// import { getMeta, store_code } from "../ut: ",

export const constants = {
  DEFAULT_TITLE: 'Xây dựng hệ thống bán hàng mạnh mẽ, mang thương hiệu của riêng bạn.',
  DEFAULT_HOME_TITLE: 'Trang chủ',
  DEFAULT_ADDRESS: 'Số 41, Ngõ 76, Phố Mai Dịch, Cầu Giấy, Hà Nội.',
  DEFAULT_PRODUCT_IMG: '/img/default_product.jpg',
  DEFAULT_SHORTCUT: '/img/default_shortcut.png',
  DEFAULT_HEADER_BACKGROUND_COLOR: 'white',
  DEFAULT_HEADER_TEXT_COLOR: '#757575',
  DEFAULT_LOGO: '',
  DEFAULT_MAIL: 'ikitech.vn@gmail.com',
  MAIN_PAGE_URL: 'https://ikitech.vn/',
  DEFAULT_PHONE: '0246.0278.753',
  DEFAULT_COLOR: '#e62e04',
  LOADING_WHEN_SUBMIT_REGISTER: 'LOADING_WHEN_SUBMIT_REGISTER',
  // STATUS
  // API_URL: getMeta("domain_api") + "/api",
  API_URL: 'http://127.0.0.1:8000' + '/api',
  API_TIKTOK_SHOP: 'https://auth.tiktok-shops.com/api',
  // STORE_CODE: store_code,
  STORE_CODE: 'chinhbv',
  LINK_STORE_CODE: 'https://services.tiktokshops.us/open/authorize?service_id=7310403104158238510',
  APP_SECRET: 'df329e59a6f78121409d77c33ee1decfbfa088a4',
  GRANT_TYPE: 'authorized_code',
  API_GOOGLE_KEY: "AIzaSyAmrEEz3cGNtY0KbHXPJu-EBrwEWHZ3070",
  API_GOOGLE_SHEETS: 'https://sheets.googleapis.com/v4/spreadsheets',
  SHEET_ID: "1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10"
}

export const statusIdentity = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
}

export const stepIdentityStatus = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
  INITIAL_VALUE: 3,
}

export const statusProduct = {
  PROGRESSING: 0,
  VIOLATION: 1,
  APPROVED: 2,
  UNAPPROVED: 3,
  DELETED: 4,
}


export const statusProductTikTokShop = [
  {color: 'default', title: 'All'},
  {color: 'gray', title: 'Draft'},
  {color: 'processing', title: 'Pending'},
  {color: 'error', title: 'Failed'},
  {color: 'success', title: 'Live'},
  {color: 'warning', title: 'Seller Deactivated'},
  {color: 'orange', title: 'Platform Deactivated'},
  {color: 'default', title: 'Freeze'},
  {color: 'red', title: 'Delete'}
]

export const statusOrder = [
  {color: 'default', title: 'UNPAID'},
  {color: 'success', title: 'PAID'}
]

export const variationsOption = [
  { value: '100000', label: 'Color' },
  // { value: '100007', label: 'Size' },
  { value: '7322572932260136746', label: 'Size' },
]