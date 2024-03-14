// import { getMeta, store_code } from "../ut: ",

export const constants = {
  // API_URL: "http://app.folinas.com:9999" + "/api",
  // API_URL: "https://app.folinas.com:8080" + "/api",
  API_URL: 'http://127.0.0.1:8000' + '/api',
  API_TIKTOK_SHOP: "https://auth.tiktok-shops.com/api",
  // STORE_CODE: store_code,
  LINK_STORE_CODE:
    "https://services.tiktokshops.us/open/authorize?service_id=7310403104158238510",
  APP_SECRET: "df329e59a6f78121409d77c33ee1decfbfa088a4",
  GRANT_TYPE: "authorized_code",
  API_GOOGLE_KEY: "AIzaSyAmrEEz3cGNtY0KbHXPJu-EBrwEWHZ3070",
  API_GOOGLE_SHEETS: "https://sheets.googleapis.com/v4/spreadsheets",
  SHEET_ID: "1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10",
  // SHEET_ID: "1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8",
  DESIGN_SKU_FILES_GOOGLE_SHEET:
    "https://docs.google.com/spreadsheets/d/1b6wjVXQ-02jxvPGCXauiQX6_x-1oyrWn_CONOHw_c10/edit#gid=380793677",
  // DESIGN_SKU_FILES_GOOGLE_SHEET: 'https://docs.google.com/spreadsheets/d/1zo6it9m4wMeLJHg0JMIHuDMoHMiY2nFLbF6IlZo3qE8/edit#gid=0',

  // API_FLASH_SHIP: "https://seller.flashship.net/seller-api",
  API_FLASH_SHIP: "https://devpod.flashship.net/seller-api",
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
  { color: "default", title: "All" },
  { color: "gray", title: "Draft" },
  { color: "processing", title: "Pending" },
  { color: "error", title: "Failed" },
  { color: "success", title: "Live" },
  { color: "warning", title: "Seller Deactivated" },
  { color: "orange", title: "Platform Deactivated" },
  { color: "default", title: "Freeze" },
  { color: "red", title: "Delete" },
];

export const statusOrder = [
  { color: "default", value: 100, title: "UNPAID" },
  { color: "magenta", value: 105, title: "ON HOLD" },
  { color: "orange", value: 111, title: "AWAITING SHIPMENT" },
  { color: "cyan", value: 112, title: "AWAITING COLLECTION" },
  { color: "blue", value: 114, title: "PARTIALLY SHIPPING" },
  { color: "purple", value: 121, title: "IN TRANSIT" },
  { color: "gold", value: 122, title: "DELIVERED" },
  { color: "green", value: 130, title: "COMPLETED" },
  { color: "red", value: 140, title: "CANCELLED" },
];

export const variationsOption = [
  { value: "100000", label: "Color" },
  // { value: '100007', label: 'Size' },
  { value: "7322572932260136746", label: "Size" },
];

export const OrderPackageWeightSize = [
  {
    name: "loại 1",
    items: [
      { name: "S", weight: "0.3", size: "9x9x2" },
      { name: "M", weight: "0.375", size: "9x9x2" },
      { name: "L", weight: "0.4375", size: "9x9x2" },
      { name: "XL", weight: "0.45", size: "10x10x3" },
      { name: "2XL", weight: "0.5625", size: "10x10x3" },
      { name: "3XL", weight: "0.5625", size: "10x10x3" },
    ],
  },
  {
    name: "T-shirt",
    items: [
      { name: "S", weight: "0.3", size: "9x9x2" },
      { name: "M", weight: "0.375", size: "9x9x2" },
      { name: "L", weight: "0.4375", size: "9x9x2" },
      { name: "XL", weight: "0.45", size: "10x10x3" },
      { name: "2XL", weight: "0.5625", size: "10x10x3" },
      { name: "3XL", weight: "0.5625", size: "10x10x3" },
    ],
  },
  {
    name: "Sweatshirt",
    items: [
      { name: "S", weight: "1", size: "9x9x2" },
      { name: "M", weight: "1.25", size: "9x9x2" },
      { name: "L", weight: "1.3125", size: "9x9x2" },
      { name: "XL", weight: "1.375", size: "10x10x3" },
      { name: "2XL", weight: "1.4375", size: "10x10x3" },
      { name: "3XL", weight: "1.5625", size: "10x10x3" },
    ],
  },
  {
    name: "Hoodie",
    items: [
      { name: "S", weight: "1", size: "9x9x2" },
      { name: "M", weight: "1.25", size: "9x9x2" },
      { name: "L", weight: "1.3125", size: "9x9x2" },
      { name: "XL", weight: "1.375", size: "10x10x3" },
      { name: "2XL", weight: "1.4375", size: "10x10x3" },
      { name: "3XL", weight: "1.5625", size: "10x10x3" },
    ],
  },
];

export const permission = {
  ADMIN: 0, // Admin
  MANAGER: 1, // Manager
  SELLER: 2, // Seller
  DESIGNER: 3, // Designer
}

export const senPrintsData = [
  {
    product_sku: "G5000",
    colors:
      "ash, black, charcoal, dark heather, forest green, heliconia, maroon, orange, purple, safety pink, white, light blue, red, yellow haze, dark chocolate, irish green, navy, royal, cardinal red, gravel, azalea, brown savana, carolina, indigo blue, kiwi, light pink, lime, sapphire, sky, violet, sport grey, daisy, tropical blue, gold, sand, military green",
    campaign_desc: `5.3 oz/yd² | 100% US Cotton 

      Heavy Cotton offers an extensive color palette across a variety of silhouettes 
      Classic width, rib collar 
      Taped neck and shoulders for comfort and durability 
      Classic fit, seamless body 
      High-performing tear-away label; transitioning to recycled material`,
    price: "",
  },
  {
    product_sku: "G5000L",
    colors:
      "black, charcoal, dark heather, heliconia, irish green, light blue, light pink, maroon, navy, orange, purple, red, royal, white, ash, azalea, sapphire, sport grey, tropical blue, violet",
    campaign_desc: `5.3 oz/yd² | 100% US Cotton 

      Heavy Cotton offers an extensive color palette across a variety of silhouettes
      Narrow width, rib collar
      Taped neck and shoulders for comfort and durability
      Cap sleeves
      Semi-fitted, side seamed body
      High-performing tear-away label; transitioning to recycled material
      `,
    price: "",
  },
  {
    product_sku: "G18500",
    colors:
      "ash, black, carolina, charcoal, dark heather, gold, heliconia, irish, navy, purple, red, royal, sport grey, white, maroon, light pink, orange, forest green, light blue, cardinal red, safety pink, sand",
    campaign_desc: `8 oz/yd² | 50% US Cotton / 50% Polyester 

    Heavy Blend features a cozy, brushed interior and an extensive color palette across a variety of silhouettes.
    Double-lined hood with color-matched drawcord
    Pouch pocket
    1x1 rib with spandex for enhanced stretch and recovery
    Classic fit, seamless body`,
    price: "",
  },
  {
    product_sku: "G18000",
    colors:
      "black, heliconia, indigo blue, irish green, light blue, light pink, maroon, navy, purple, red, royal, sport grey, white, dark heather, orange, ash, cardinal red, carolina, forest green, gold, safety pink, sand",
    campaign_desc: `8 oz/yd² | 50% US Cotton / 50% Polyester 

    Heavy Blend features a cozy, brushed interior and an extensive color palette across a variety of silhouettes.
    1x1 rib with spandex for enhanced stretch and recovery
    Classic fit, seamless body
    `,
    price: "",
  },
  {
    product_sku: "G64V00",
    colors:
      "black, navy, sport grey, white, cherry red, dark heather, heather purple, royal",
    campaign_desc: `4.5 oz/yd² | 90% Ring Spun Cotton / 10% Polyester 

    Made with our soft ring spun cotton and cotton blends, Softstyle's high stitch density fabric offers a smooth printing surface.
    Narrow width, rib collar
    Taped neck and shoulders for comfort and durability
    Modern classic fit, side seamed body
    High-performing black tear-away label; transitioning to recycled material
    `,
    price: "",
  },
  {
    product_sku: "G5V00L",
    colors:
      " azalea, black, charcoal, coral, graphite heather, heather navy, heather radiant orchid, heliconia, irish green, lime, navy, purple, red, royal, sapphire, sport grey, white",
    campaign_desc: `5.3 oz/yd² | 100% US Cotton 

    Heavy Cotton offers an extensive color palette across a variety of silhouettes 
    Narrow width, rib collar 
    Taped neck and shoulders for comfort and durability 
    Cap sleeves 
    Semi-fitted, side seamed body 
    High-performing tear-away label; transitioning to recycled material
    `,
    price: "",
  },
  {
    product_sku: "G2400",
    colors:
      "ash, black, carolina, dark chocolate, forest green, gold, irish green, light pink, navy, orange, purple, red, royal, sport grey, white, cardinal red, dark heather, light blue, maroon, s- orange, texas orange, charcoal",
    campaign_desc: `6 oz/yd² | 99% US Cotton / 1% Polyester 

    Ultra Cotton's heavyweight fabric provides structure and durability in an extensive color palette, making it a great choice for everyday and workwear.
    Classic width, rib collar
    Taped neck and shoulders for comfort and durability
    Rib cuffs
    Classic fit, seamless body
    High-performing tear-away label; transitioning to recycled material
    `,
    price: "",
  },
  {
    product_sku: "AWLST",
    colors: "white, black, sport grey, navy, azalea",
    campaign_desc: `5 oz/yd² | 100% Polyester 
    Performance, 100% spun polyester styles, are the ideal choice for sublimating. 
    These styles offer moisture wicking, odor control and snag-resistance properties with a soft hand of cotton, making them an athleisure staple 
    Single-needle topstitched, classic width collar 
    Taped neck and shoulders for comfort and durability 
    Modern classic fit, side seamed body 
    High-performing tear-away label; transitioning to recycled material    
    `,
    price: "",
  },
  {
    product_sku: "G5200",
    colors: "black, navy, white, graphite heather, red, royal, sport grey",
    campaign_desc: `5.3 oz/yd² | 50% US Cotton / 50% Polyester 

    Heavy Cotton offers an extensive color palette across a variety of silhouettes
    Bound neck and armholes
    Classic fit, side seamed body
    High-performing tear-away label; transitioning to recycled material
    `,
    price: "",
  },
  {
    product_sku: "AWTT",
    colors: "white, black, sport grey, navy, red",
    campaign_desc: `153.0 G/SqM (White 144.0 G/SqM) 
    100% Ring-Spun Cotton 
    Fitted silhouette with side seam 
    High stitch density for smoother printing surface 
    1 1/2"" straps for S - L // 1 3/4"" straps for XL & 2XL 
    Rib knit trim applied to neckline and armholes 
    Tearaway label 
    Twin needle bottom hem
    `,
    price: "",
  },
  {
    product_sku: "G5000B",
    colors: "black, daisy, dark chocolate, irish green, light blue, navy, red, royal, safety orange, sand, white, light pink, purple, sport grey, ash, cardinal red, carolina, dark heather, forest green, heliconia, maroon, violet, charcoal, sapphire, orange, safety pink",
    campaign_desc: `5.3 oz/yd² | 90% US Cotton / 10% Polyester 

    Heavy Cotton offers an extensive color palette across a variety of silhouettes 
    Classic width, rib collar 
    Taped neck and shoulders for comfort and durability 
    Classic fit, seamless body 
    High-performing tear-away label; transitioning to recycled material
    `,
    price: "",
  },
  {
    product_sku: "AKSSW",
    colors:
      "white, black, sport grey, royal, navy, red, dark heather, maroon, forest green, light blue",
    campaign_desc: `Spun yarn for softer feel and reduced pilling 
    Classic fit tubular body 
    Double-needle stitching at shoulders, armholes, neck, waistband and cuffs 
    Grey pearlized tear away label 
    1x1 rib with spandex for enhanced stretch and recovery 
    100% of our fabric cutting scraps are recycled into fiber and used in new products 
    33% of the energy used to manufacture our products comes from renewable resources
    `,
    price: "",
  },
  {
    product_sku: "G18500B",
    colors:
      "black, carolina, charcoal, dark heather, forest green, gold, irish green, light pink, maroon, navy, orange, purple, red, royal, sport grey, white",
    campaign_desc: `Heavy Blend features a cozy, brushed interior and an extensive color palette across a variety of silhouettes. 
    Double-lined hood 
    Pouch pocket 
    1x1 rib with spandex for enhanced stretch and recovery 
    Classic fit, seamless body 
    High-performing tear-away label; transitioning to recycled material
    `,
    price: "",
  },
  {
    product_sku: "LAT3321",
    colors:
      "black, butter, kelly green, key lime, light blue, orange, pink, raspberry, red, white, royal, sport grey, navy",
    campaign_desc: `Rabbit Skins® Toddler 100% Combed Ringspun Cotton Fine Jersey Crew Neck Short Sleeve Tee 

    Classic comfort meets color with these soft crew neck t-shirts for toddlers. Whether layered or alone, this t-shirt is soft, yet durable enough to stand up to your toddler's playtime demands. 
    
    Fabrication: 4.5 oz. 100% combed ringspun cotton fine jersey • Ash is 99/1; CVC Colors are 60/40; Heather is 90/10 combed ringspun cotton/polyester • Ash and White are sewn with 100% cotton thread 
    
    Features: Topstitched ribbed collar • Shoulder-to-shoulder self-fabric back neck tape • Double needle sleeves and bottom hem • Side seam construction • EasyTear™ label 
    
    Safety: CPSIA compliant tracking label in side seam 
    
    Care: Machine wash • Tumble dry low
    `,
    price: "",
  },
  {
    product_sku: "LAT4400",
    colors:
      "banana, black, charcoal, sport grey, kelly green, navy, pink, purple, red, royal, turquoise, white, yellow",
    campaign_desc: `Rabbit Skins® Infant 100% Combed Ringspun Cotton 1x1 Baby Rib Lap Shoulder Short Sleeve Bodysuit 

    An ideal gift for any new parent who will want one in every color. These one-piece plain bodysuits feature lap shoulders to make it easier for the many times a day that parents have to change baby's outfit. 
    
    Fabrication: 5.0 oz. 100% combed ringspun cotton 1x1 baby rib • CVC Colors are 60/40; Heather is 90/10 combed ringspun cotton/polyester • White is sewn with 100% cotton thread 
    
    Features: Flatlock stitched seams • Double needle ribbed binding on lap shoulder neck, shoulders, sleeves and leg opening • Innovative three snap closure • Side seam construction • EasyTear™ label 
    
    Safety: CPSIA compliant tracking label in side seam 
    
    Care: Machine wash • Tumble dry low
    `,
    price: "",
  },
];
