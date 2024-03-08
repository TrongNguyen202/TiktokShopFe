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
  API_URL: 'http://app.folinas.com:9999' + "/api",
  // API_URL: 'http://127.0.0.1:8000' + '/api',
  API_TIKTOK_SHOP: 'https://auth.tiktok-shops.com/api',
  // STORE_CODE: store_code,
  STORE_CODE: 'chinhbv',
  LINK_STORE_CODE: 'https://services.tiktokshops.us/open/authorize?service_id=7310403104158238510',
  APP_SECRET: 'df329e59a6f78121409d77c33ee1decfbfa088a4',
  GRANT_TYPE: 'authorized_code',
  API_GOOGLE_KEY: "AIzaSyAmrEEz3cGNtY0KbHXPJu-EBrwEWHZ3070",
  API_GOOGLE_SHEETS: 'https://sheets.googleapis.com/v4/spreadsheets',
  SHEET_ID: "1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10",
  // SHEET_ID: "1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8",
  DESIGN_SKU_FILES_GOOGLE_SHEET: 'https://docs.google.com/spreadsheets/d/1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10/edit#gid=380793677',
  // DESIGN_SKU_FILES_GOOGLE_SHEET: 'https://docs.google.com/spreadsheets/d/1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8/edit#gid=0',

  API_FLASH_SHIP: 'https://seller.flashship.net/seller-api/orders',
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
  { color: 'default', title: 'All' },
  { color: 'gray', title: 'Draft' },
  { color: 'processing', title: 'Pending' },
  { color: 'error', title: 'Failed' },
  { color: 'success', title: 'Live' },
  { color: 'warning', title: 'Seller Deactivated' },
  { color: 'orange', title: 'Platform Deactivated' },
  { color: 'default', title: 'Freeze' },
  { color: 'red', title: 'Delete' }
]

export const statusOrder = [
  { color: 'default', value: 100, title: 'UNPAID' },
  { color: 'magenta', value: 105, title: 'ON HOLD' },
  { color: 'orange', value: 111, title: 'AWAITING SHIPMENT' },
  { color: 'cyan', value: 112, title: 'AWAITING COLLECTION' },
  { color: 'blue', value: 114, title: 'PARTIALLY SHIPPING' },
  { color: 'purple', value: 121, title: 'IN TRANSIT' },
  { color: 'gold', value: 122, title: 'DELIVERED' },
  { color: 'green', value: 130, title: 'COMPLETED' },
  { color: 'red', value: 140, title: 'CANCELLED' }
]

export const variationsOption = [
  { value: '100000', label: 'Color' },
  // { value: '100007', label: 'Size' },
  { value: '7322572932260136746', label: 'Size' },
]


export const OrderPackageWeightSize = [
  {
    name: "loại 1",
    items: [
      {"name": "S", "weight": "0.3", "size": "9x9x2" },
      {"name": "M", "weight": "0.375", "size": "9x9x2" },
      {"name": "L", "weight": "0.4375", "size": "9x9x2" },
      {"name": "XL", "weight": "0.45", "size": "10x10x3"},
      {"name": "2XL", "weight": "0.5625", "size": "10x10x3"},
      {"name": "3XL", "weight": "0.5625", "size": "10x10x3"}
    ]
  },
  {
    name: "T-shirt",
    items: [
      {"name": "S", "weight": "0.3", "size": "9x9x2" },
      {"name": "M", "weight": "0.375", "size": "9x9x2" },
      {"name": "L", "weight": "0.4375", "size": "9x9x2" },
      {"name": "XL", "weight": "0.45", "size": "10x10x3"},
      {"name": "2XL", "weight": "0.5625", "size": "10x10x3"},
      {"name": "3XL", "weight": "0.5625", "size": "10x10x3"},
    ]
  },
  {
    name: "Sweatshirt",
    items: [
      {"name": "S", "weight": "1", "size": "9x9x2" },
      {"name": "M", "weight": "1.25", "size": "9x9x2" },
      {"name": "L", "weight": "1.3125", "size": "9x9x2" },
      {"name": "XL", "weight": "1.375", "size": "10x10x3"},
      {"name": "2XL", "weight": "1.4375", "size": "10x10x3"},
      {"name": "3XL", "weight": "1.5625", "size": "10x10x3"},
    ]
  },
  {
    name: "Hoodie",
    items: [
      {"name": "S", "weight": "1", "size": "9x9x2" },
      {"name": "M", "weight": "1.25", "size": "9x9x2" },
      {"name": "L", "weight": "1.3125", "size": "9x9x2" },
      {"name": "XL", "weight": "1.375", "size": "10x10x3"},
      {"name": "2XL", "weight": "1.4375", "size": "10x10x3"},
      {"name": "3XL", "weight": "1.5625", "size": "10x10x3"},
    ]
  }
]

export const permission = {
  ADMIN: 0, // Admin
  MANAGER: 1, // Manager
  SELLER: 2, // Seller
  DESIGNER: 3, // Designer
}

