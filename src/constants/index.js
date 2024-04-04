export const constants = {
  // API_URL: 'http://seller.folinas.com:9999/api',
  API_URL: import.meta.env.VITE_API_URL || 'http://192.168.1.254:8000/api',
  // API_URL: import.meta.env.VITE_API_URL || 'https://dev.folinas.com:8000/api',
  // API_URL: 'http://192.168.1.254:8000/api',
  API_TIKTOK_SHOP: 'https://auth.tiktok-shops.com/api',
  // STORE_CODE: store_code,
  LINK_STORE_CODE: 'https://services.tiktokshops.us/open/authorize?service_id=7310403104158238510',
  APP_SECRET: 'df329e59a6f78121409d77c33ee1decfbfa088a4',
  GRANT_TYPE: 'authorized_code',
  API_GOOGLE_KEY: 'AIzaSyAmrEEz3cGNtY0KbHXPJu-EBrwEWHZ3070',
  API_GOOGLE_SHEETS: 'https://sheets.googleapis.com/v4/spreadsheets',
  SHEET_ID: '1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10',
  // SHEET_ID: '1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8',
  DESIGN_SKU_FILES_GOOGLE_SHEET:
    'https://docs.google.com/spreadsheets/d/1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10/edit#gid=380793677',
  // DESIGN_SKU_FILES_GOOGLE_SHEET: 'https://docs.google.com/spreadsheets/d/1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8/edit#gid=0',

  // API_FLASH_SHIP: 'https://seller.flashship.net/seller-api',
  API_FLASH_SHIP: 'https://devpod.flashship.net/seller-api',
  TOKEN_FLASH_SHIP_EXPIRATION: 2*60*60*1000,
};

export const statusIdentity = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
};

export const stepIdentityStatus = {
  PROGRESSING: 0,
  UNAPPROVED: 1,
  APPROVED: 2,
  INITIAL_VALUE: 3,
};

export const statusProduct = {
  PROGRESSING: 0,
  VIOLATION: 1,
  APPROVED: 2,
  UNAPPROVED: 3,
  DELETED: 4,
};

export const statusProductTikTokShop = [
  { color: 'default', title: 'All' },
  { color: 'gray', title: 'Draft' },
  { color: 'processing', title: 'Pending' },
  { color: 'error', title: 'Failed' },
  { color: 'success', title: 'Live' },
  { color: 'warning', title: 'Seller Deactivated' },
  { color: 'orange', title: 'Platform Deactivated' },
  { color: 'default', title: 'Freeze' },
  { color: 'red', title: 'Delete' },
];

export const statusOrder = [
  { color: 'default', value: 100, title: 'UNPAID' },
  { color: 'magenta', value: 105, title: 'ON HOLD' },
  { color: 'orange', value: 111, title: 'AWAITING SHIPMENT' },
  { color: 'cyan', value: 112, title: 'AWAITING COLLECTION' },
  { color: 'blue', value: 114, title: 'PARTIALLY SHIPPING' },
  { color: 'purple', value: 121, title: 'IN TRANSIT' },
  { color: 'gold', value: 122, title: 'DELIVERED' },
  { color: 'green', value: 130, title: 'COMPLETED' },
  { color: 'red', value: 140, title: 'CANCELLED' },
];

export const variationsOption = [
  { value: '100000', label: 'Color' },
  // { value: '100007', label: 'Size' },
  { value: '7322572932260136746', label: 'Size' },
];

export const OrderPackageWeightSize = [
  {
    name: 'loại 1',
    items: [
      { name: 'S', weight: '0.3', size: '9x9x2' },
      { name: 'M', weight: '0.38', size: '9x9x2' },
      { name: 'L', weight: '0.44', size: '9x9x2' },
      { name: 'XL', weight: '0.45', size: '10x10x3' },
      { name: '2XL', weight: '0.56', size: '10x10x3' },
      { name: '3XL', weight: '0.56', size: '10x10x3' },
    ],
  },
  {
    name: 'shirt',
    items: [
      { name: 'S', weight: '0.3', size: '9x9x2' },
      { name: 'M', weight: '0.38', size: '9x9x2' },
      { name: 'L', weight: '0.44', size: '9x9x2' },
      { name: 'XL', weight: '0.45', size: '10x10x3' },
      { name: '2XL', weight: '0.56', size: '10x10x3' },
      { name: '3XL', weight: '0.56', size: '10x10x3' },
    ],
  },
  {
    name: 'Sweatshirt',
    items: [
      { name: 'S', weight: '1', size: '9x9x2' },
      { name: 'M', weight: '1.25', size: '9x9x2' },
      { name: 'L', weight: '1.31', size: '9x9x2' },
      { name: 'XL', weight: '1.38', size: '10x10x3' },
      { name: '2XL', weight: '1.44', size: '10x10x3' },
      { name: '3XL', weight: '1.56', size: '10x10x3' },
    ],
  },
  {
    name: 'Hoodie',
    items: [
      { name: 'S', weight: '1', size: '9x9x2' },
      { name: 'M', weight: '1.25', size: '9x9x2' },
      { name: 'L', weight: '1.31', size: '9x9x2' },
      { name: 'XL', weight: '1.38', size: '10x10x3' },
      { name: '2XL', weight: '1.44', size: '10x10x3' },
      { name: '3XL', weight: '1.56', size: '10x10x3' },
    ],
  },
];

export const permission = {
  ADMIN: 0, // Admin
  MANAGER: 1, // Manager
  SELLER: 2, // Seller
  DESIGNER: 3, // Designer
};

export const senPrintsData = [
  {
    product_sku: 'AMST',
    colors:
      'ash, black, charcoal, dark heather, forest green, heliconia, maroon, orange, purple, safety pink, white, light blue, red, yellow haze, dark chocolate, irish green, navy, royal, cardinal red, gravel, azalea, brown savana, carolina, indigo blue, kiwi, light pink, lime, sapphire, sky, violet, sport grey, daisy, tropical blue, gold, sand, military green',
    campaign_desc: `Preshrunk t-shirt in 100% cotton.
    Sport Grey:  90% US Cotton / 10% Polyester
    Dark Heather: 50% US Cotton / 50% Polyester
    Seamless twin needle 7/8" collar.
    Taped neck and shoulders. Rolled forward shoulders for better fit.
    Twin needle sleeve and bottom hems. Quarter-turned to eliminate centre crease.`,
    price: '32.84',
  },
  {
    product_sku: 'AUSH',
    colors:
      'white, black, sport grey, navy, red, royal, military green, light blue, charcoal, irish green, purple, forest green, ash, light pink, gold, orange, maroon, sand, dark heather',
    campaign_desc: `50% Cotton / 50% Polyester
Preshrunk fleece knit
Double-lined hood with colour-matched drawcord
Double-needle stitching at shoulder, armhole, neck, waistband and cuffs
Pouch pocket
1 x 1 rib with spandex
Air jet yarns = softer feel and reduced pilling
Tear away label`,
    price: '65.70',
  },
  {
    product_sku: 'AUSS',
    colors:
      'white, black, sport grey, navy, red, royal, irish green, forest green, light blue, purple, dark heather, orange, ash, light pink, sand, maroon, military green',
    campaign_desc: `1x1 rib with spandex
    Air jet yarn for softer feel and reduced pilling
    Double-needle stitching at shoulder, armhole, neck, waistband and cuffs
    Fiber content varies by color, see color list for exceptions
    Preshrunk fleece knit
    Tear away label`,
    price: '57.13',
  },
  {
    product_sku: 'AMVT',
    colors:
      'white, black, sport grey, navy, red, royal, charcoal, irish green, heather irish green, purple, heather purple, dark heather',
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM)
    100% Ring Spun Cotton
    In transition to 100% Combed Ring Spun Cotton
    Eurofit - sleeker fit in shoulder and sleeve
    Semi-fitted
    High stitch density for smoother printing surface
    1.6 cm mitered v-neck collar
    Taped neck and shoulders
    Tearaway label
    Rolled forward shoulder
    Twin needle sleeve and bottom hems
    Quarter-turned to eliminate center crease
    `,
    price: '41.41',
  },
  {
    product_sku: 'AWVT',
    colors: 'white, black, sport grey, navy, red, royal, irish green, purple, heather purple, azalea, dark heather',
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM)
    100% Ring Spun Cotton
    In transition to 100% Combed Ring Spun Cotton
    Fitted silhouette with side seam
    High stitch density for smoother printing surface
    1/2"" mitered v-neck collar
    Taped neck and shoulders
    Tearaway label
    Twin needle sleeve and bottom hems
    `,
    price: '41.41',
  },
  {
    product_sku: 'AMLST',
    colors:
      'white, black, sport grey, red, royal, navy, carolina, light blue, light pink, irish green, forest green, purple, gold, dark heather, orange',
    campaign_desc: `Classic midweight fabric
    Double-needle bottom hem
    Fiber content varies by color, see color list for exceptions
    Rib cuffs
    Seamless double-needle 7/8"" collar
    Taped neck and shoulders
    Tear away label
    `,
    price: '47.13',
  },
  {
    product_sku: 'AWLST',
    colors: 'white, black, sport grey, navy, azalea',
    campaign_desc: `5 oz/yd² | 100% Polyester
    Performance, 100% spun polyester styles, are the ideal choice for sublimating.
    These styles offer moisture wicking, odor control and snag-resistance properties with a soft hand of cotton, making them an athleisure staple
    Single-needle topstitched, classic width collar
    Taped neck and shoulders for comfort and durability
    Modern classic fit, side seamed body
    High-performing tear-away label; transitioning to recycled material
    `,
    price: '47.13',
  },
  {
    product_sku: 'AMTT',
    colors: 'white, black, sport grey, red, royal, purple, forest green, orange',
    campaign_desc: `Preshrunk jersey knit
    Bound neck and armholes
    Sideseamed
    Double-needle bottom hem
    Classic midweight fabric
    Tear away label    
    `,
    price: '41.41',
  },
  {
    product_sku: 'AWTT',
    colors: 'white, black, sport grey, navy, red',
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM)
    100% Ring-Spun Cotton
    Fitted silhouette with side seam
    High stitch density for smoother printing surface
    1 1/2"" straps for S - L // 1 3/4"" straps for XL & 2XL
    Rib knit trim applied to neckline and armholes
    Tearaway label
    Twin needle bottom hem
    `,
    price: '41.41',
  },
  {
    product_sku: 'AYST',
    colors:
      'white, black, sport grey, navy, royal, red, purple, light blue, light pink, irish green, forest green, dark chocolate',
    campaign_desc: `100% Cotton
    Seamless twin needle 3/4"" collar
    Taped neck and shoulders
    Tearaway label
    Twin needle sleeve and bottom hems
    Quarter-turned to eliminate center crease
    CPSIA Tracking Label Compliant
    `,
    price: '35.70',
  },
  {
    product_sku: 'AKSSW',
    colors: 'white, black, sport grey, royal, navy, red, dark heather, maroon, forest green, light blue',
    campaign_desc: `Spun yarn for softer feel and reduced pilling
    Classic fit tubular body 
    Double-needle stitching at shoulders, armholes, neck, waistband and cuffs
    Grey pearlized tear away label
    1x1 rib with spandex for enhanced stretch and recovery
    100% of our fabric cutting scraps are recycled into fiber and used in new products
    33% of the energy used to manufacture our products comes from renewable resources
    `,
    price: '51.41',
  },
  {
    product_sku: 'AYPH',
    colors:
      'white, black, sport grey, navy, royal, red, kelly green, gold, light blue, carolina, irish green, charcoal, purple, light pink, orange, forest green, dark heather',
    campaign_desc: `Preshrunk fleece knit
    Double-lined hood
    Double-needle stitching at shoulder, armhole, neck, waistband and cuffs
    Pouch pocket
    1 x 1 rib with spandex
    Air jet yarns = softer feel and reduced pilling
    Tear away label
    CPSIA Tracking Label Compliant
    `,
    price: '58.56',
  },
  {
    product_sku: 'LAT3321',
    colors:
      'black, butter, kelly green, key lime, light blue, orange, pink, raspberry, red, white, royal, sport grey, navy',
    campaign_desc: `Rabbit Skins® Toddler 100% Combed Ringspun Cotton Fine Jersey Crew Neck Short Sleeve Tee

    Classic comfort meets color with these soft crew neck t-shirts for toddlers. Whether layered or alone, this t-shirt is soft, yet durable enough to stand up to your toddler's playtime demands.
    
    Fabrication: 4.5 oz. 100% combed ringspun cotton fine jersey • Ash is 99/1; CVC Colors are 60/40; Heather is 90/10 combed ringspun cotton/polyester • Ash and White are sewn with 100% cotton thread
    
    Features: Topstitched ribbed collar • Shoulder-to-shoulder self-fabric back neck tape • Double needle sleeves and bottom hem • Side seam construction • EasyTear™ label
    
    Safety: CPSIA compliant tracking label in side seam
    
    Care: Machine wash • Tumble dry low
    `,
    price: '38.56',
  },
  {
    product_sku: 'LAT4400',
    colors:
      'banana, black, charcoal, sport grey, kelly green, navy, pink, purple, red, royal, turquoise, white, yellow',
    campaign_desc: `Rabbit Skins® Infant 100% Combed Ringspun Cotton 1x1 Baby Rib Lap Shoulder Short Sleeve Bodysuit

    An ideal gift for any new parent who will want one in every color. These one-piece plain bodysuits feature lap shoulders to make it easier for the many times a day that parents have to change baby's outfit.
    
    Fabrication: 5.0 oz. 100% combed ringspun cotton 1x1 baby rib • CVC Colors are 60/40; Heather is 90/10 combed ringspun cotton/polyester • White is sewn with 100% cotton thread
    
    Features: Flatlock stitched seams • Double needle ribbed binding on lap shoulder neck, shoulders, sleeves and leg opening • Innovative three snap closure • Side seam construction • EasyTear™ label
    
    Safety: CPSIA compliant tracking label in side seam
    
    Care: Machine wash • Tumble dry low
    `,
    price: '41.41',
  },
];

