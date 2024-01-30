
from googleapiclient.discovery import build
from google.oauth2 import service_account

# Thông tin xác thực từ tệp JSON bạn đã tải xuống
SERVICE_ACCOUNT_FILE = 'api/utils/google/googledriverconfig.json'
PARENT_FOLDER_ID = "1fcgoUghiIh_sr7JxUnL9_2xObkCfBM94"

# Phạm vi quyền truy cập API, ở đây là đọc và ghi vào Google Drive
SCOPES = [
    'https://www.googleapis.com/auth/drive.metadata.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.appdata'
]

def authenticate():
    creds = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return creds

def upload_pdf(file_path, order_id):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)
    file_metadata = {
        'name': order_id,
        'parents': [PARENT_FOLDER_ID]
    }
    file = service.files().create(
        body=file_metadata,
        media_body=file_path
    ).execute()

# upload_pdf("testpdf2.pdf")


def search_file(file_name):
    creds = authenticate()
    service = build('drive', 'v3', credentials=creds)

    # Perform the search query
    query = f"name='{file_name}'"
    results = service.files().list(q=query).execute()

    files = results.get('files', [])

    search_results = []

    if not files:
        print(f"No files found with the name '{file_name}'.")
    else:
        print(f"Files found with the name '{file_name}':")
        for file in files:
            file_info = {
                'name': file['name'],
                'link': f"https://drive.google.com/file/d/{file['id']}"
            }
            search_results.append(file_info)
            

    return search_results

