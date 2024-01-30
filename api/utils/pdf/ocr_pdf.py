import platform
from tempfile import TemporaryDirectory
from pathlib import Path
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import json

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

path_to_poppler_exe = Path(r"C:\Users\Dell\Downloads\TikTokShop AIO version 3.4.3\TikTokShop AIO version 3.4.3\dependencies\poppler\Library\bin")
out_directory = Path(r"C:\output").expanduser()
PDF_file = Path(r"C:\Users\Dell\Downloads\maintestpdf.pdf")
text_file = out_directory / Path("out_text.txt")

def process_pdf(pdf_path, out_directory):
    result_data = {"entries": []}
    
    with TemporaryDirectory() as tempdir:
        if platform.system() == "Windows":
            pdf_pages = convert_from_path(pdf_path, 500, poppler_path=path_to_poppler_exe)
        else:
            pdf_pages = convert_from_path(pdf_path, 500)

        image_file_list = []

        for page_enumeration, page in enumerate(pdf_pages, start=1):
            filename = f"{tempdir}/page_{page_enumeration:03}.png"
            page.save(filename, "PNG")
            image_file_list.append(filename)

        for image_file in image_file_list:
            text = str(pytesseract.image_to_string(Image.open(image_file)))
            text = text.replace("-\n", "")

            lines = text.split('\n')
            lines = [line for line in lines if line != ""]

            entry_data = {}
            for i, line in enumerate(lines):
                if "USPS TRACKING #" in line:
                    entry_data["tracking_id"] = lines[i+1]
                    entry_data["name_buyer"] = lines[i-3]
                    wrong_street = lines[i-2]
                    entry_data["real_street"] = ""
                    wrong_city_state_zipcode = lines[i-1]
                    

                    for i, text in enumerate(wrong_street):
                        if text == " ":
                            entry_data["real_street"] = wrong_street[i:]
                            break

                    first_space_index = wrong_city_state_zipcode.find(" ")
                    if first_space_index != -1:
                        second_space_index = wrong_city_state_zipcode.find(" ", first_space_index + 1)
                        city = wrong_city_state_zipcode[first_space_index + 1:second_space_index] if second_space_index != -1 else wrong_city_state_zipcode[first_space_index + 1:]

                        third_space_index = wrong_city_state_zipcode.find(" ", second_space_index + 1)
                        state = wrong_city_state_zipcode[second_space_index + 1:third_space_index] if third_space_index != -1 else wrong_city_state_zipcode[second_space_index + 1:]

                        zip_code = wrong_city_state_zipcode[third_space_index + 1:] if third_space_index != -1 else ""
                        entry_data["city"] = city
                        entry_data["state"] = state
                        entry_data["zip_code"] = zip_code

            result_data["entries"].append(entry_data)

    return json.dumps(result_data, indent=2)

result_json = process_pdf(PDF_file, text_file)
print(result_json)
