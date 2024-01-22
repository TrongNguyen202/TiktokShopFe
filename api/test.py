from PIL import Image
import cv2
def process_image(input_path,output_path):
    try:
        # Mở ảnh từ đường dẫn
        img = Image.open(input_path)
        img.save(output_path, format='PNG')
        # Kiểm tra bitdepth của ảnh
        mode = img.mode
        print(mode)
 
        # bitdepth = mode_to_bpp.get(mode, None)

        # if bitdepth is not None:
        #     print(f"Bitdepth của ảnh là {bitdepth} bits.")

        #     if mode == 'RGB' and bitdepth == 32:
        #         # Nếu mode là 'P' và bitdepth là 8, chuyển đổi ảnh về RGB
        #         img = img.convert('P')
        #         img.save(file_path)
        #         print("Chuyển đổi ảnh về P.")

        #     else:
        #         print("Không cần chuyển đổi ảnh.")

        # else:
        #     print("Bitdepth của ảnh không được xác định.")

    except Exception as e:
        print(f"Lỗi khi xử lý ảnh: {e}")

# Gọi hàm để xử lý ảnh
process_image('C:/anhtiktok/trong.jpg','C:/anhtiktok/trongpng.png')



# from PIL import Image

# img = Image.open('trong.jpg')
# a = img.convert('RGB', colors=256)
# with open('trong.png', 'wb') as f:
#     a.save(f, 'PNG', optimize=True, quality=95