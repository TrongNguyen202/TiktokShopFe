import json
import logging
import platform
from pathlib import Path
from typing import Optional

import pytesseract
from pdf2image import convert_from_path
from PIL import Image

from api import setup_logging

# Setup logger
logger = logging.getLogger('api.utils.pdf.ocr_pdf')
setup_logging(logger=logger, level=logging.INFO)


# Window users need to specify the path
if platform.system() == "Windows":
    pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'
    path_to_poppler_exe = Path(r"C:\Library\bin")


def __parse_info(info: str) -> Optional[dict]:
    try:
        info = info.strip()
        parts = info.split('\n')
        print(f"==>> parts: {parts}")

        name = parts[0]
        details = parts[-1]

        address = info.replace(name, '').replace(details, '').strip()

        while '\n' in address:
            address = address.replace('\n', ' ')

        # Get zipcode
        zipcode = details.split()[-1]
        details = details.replace(zipcode, '').strip()

        # Get the state abbreviation
        state = details.split()[-1]
        details = details.replace(state, '').strip()

        # Get the city
        city = details.strip()

        return {
            'name': name,
            'address': address,
            'city': city,
            'state': state,
            'zipcode': zipcode
        }
    except Exception as e:
        logger.error(f"An error occurred while parsing the info: ", exec_info=e)
        return None


def __clean_tracking_id(tracking_id: str):
    tracking_id = tracking_id.strip()
    tracking_id = tracking_id.replace(',', '')
    tracking_id = tracking_id.replace('.', '')
    tracking_id = tracking_id.replace(' ', '')

    return tracking_id


def _ocr_image(file_path: str, image: Image) -> dict:
    try:
        # Read the image info
        x, y = image.size
        logger.info(f"{file_path}: Image size: {x}x{y}")

        if platform.system() == "Windows":
            if not (x == 803 and y == 1206):
                logger.error(f"Kích thước label không phải là (4 x 6) for file: {file_path}")
                return {
                    'file': file_path,
                    'status': 'error',
                    'message': 'Kích thước label không phải là 803x1206 (4 x 6)',
                    'data': None
                }
        else:
            if not (x == 2007 and y == 3014):
                logger.error(f"Image size is not 2007x3014 (4 x 6) for file: {file_path}")
                return {
                    'file': file_path,
                    'status': 'error',
                    'message': 'Kích thước label không phải là 2007x3014 (4 x 6)',
                    'data': None
                }

        # (x1, y1, x2, y2)
        if platform.system() == "Windows":
            tracking_id_img = image.crop((105, 955, 660, 992))
            user_info = image.crop((138, 568, 738, 746))
        else:
            tracking_id_img = image.crop((150, 2394, 1817, 2473))
            user_info = image.crop((339, 1407, 1838, 1857))

        # Extract text from image
        tracking_id: str = __clean_tracking_id(pytesseract.image_to_string(tracking_id_img))
        user_info: str = pytesseract.image_to_string(user_info)

        # Parse user info
        user_info = __parse_info(user_info)

        if user_info is None:
            return {
                'file': file_path,
                'status': 'error',
                'message': 'Có lỗi xảy ra khi parse thông tin người nhận. Kiểm tra lại shipping label',
                'data': None
            }

        logger.info(f'OCR file {file_path} successfully, user_info: {user_info}, tracking_id: {tracking_id}')

        # Return the result
        data = {'tracking_id': tracking_id}
        data.update(user_info)

        return {
            'file': file_path,
            'status': 'success',
            'message': 'OCR file PDF thành công',
            'data': data
        }
    except Exception as e:
        logger.error(f"An error occurred while processing the image", exc_info=e)
        return {
            'file': file_path,
            'status': 'error',
            'message': 'Có lỗi xảy ra khi OCR file PDF. Kiểm tra lại shipping label',
            'data': None
        }


def process_pdf_to_info(pdf_path: str) -> dict:
    """ 
        Convert an PDF shipping label into a dictionary of shipping information
    Args:
        pdf_path (str): The path to the PDF file

    Returns:
        dict: A dictionary of shipping information
    """
    if platform.system() == "Windows":
        PIL_pdf_pages = convert_from_path(pdf_path, 500, poppler_path=path_to_poppler_exe)
    else:
        PIL_pdf_pages = convert_from_path(pdf_path, 500)

    if len(PIL_pdf_pages) > 1:
        return {
            'file': pdf_path,
            'status': 'error',
            'message': 'Có nhiều hơn 1 trang trong file PDf. Kiểm tra lại shipping label',
            'data': None
        }

    output = _ocr_image(file_path=pdf_path, image=PIL_pdf_pages[0])

    return output
