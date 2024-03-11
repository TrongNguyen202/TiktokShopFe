import platform
from tempfile import TemporaryDirectory
from pathlib import Path
import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import json

pytesseract.pytesseract.tesseract_cmd = r'C:\Tesseract-OCR\tesseract.exe'

path_to_poppler_exe = Path(r"C:\Library\bin")
out_directory = Path(r"C:\output").expanduser()
text_file = out_directory / Path("out_text.txt")


def remove_special_characters(text):
    # Thay thế các kí tự đặc biệt bằng chuỗi trống
    special_characters = ['!', '@', '#', '$', '%', '^', '&', '*',
                          '(', ')', '-', '_', '+', '=', '[', ']', '{', '}', ';', ':', ',', '.', '<', '>', '/', '?', '\\', '|']

    # Xóa kí tự đặc biệt ở đầu
    for char in special_characters:
        if text.startswith(char):
            text = text[len(char):]
            break

    # Xóa kí tự đặc biệt ở cuối
    for char in special_characters:
        if text.endswith(char):
            text = text[:-len(char)]
            break

    return text.strip()


def process_pdf(pdf_path):
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
            lines = [remove_special_characters(line) for line in lines]
            print(lines)

            entry_data = {}
            for i, line in enumerate(lines):
                if "USPS TRACKING" in line:
                    entry_data["tracking_id"] = lines[i+1]
                    entry_data["name_buyer"] = lines[i-3]
                    wrong_street = lines[i-2]
                    entry_data["real_street"] = ""
                    wrong_city_state_zipcode = lines[i-1]

                    for i, text in enumerate(wrong_street):
                        if text == " ":
                            entry_data["real_street"] = wrong_street[i:]
                            break

                    # Lấy 10 kí tự cuối làm zipcode
                    zip_code = wrong_city_state_zipcode[-10:]

                    # Lấy hai kí tự tiếp theo làm state
                    state = wrong_city_state_zipcode[-13:-10]

                    # Còn lại là city
                    city = wrong_city_state_zipcode[:-13].strip()
                    city = city[2:]

                    entry_data["city"] = city
                    entry_data["state"] = state
                    entry_data["zip_code"] = zip_code

    return json.dumps(entry_data, indent=2)
