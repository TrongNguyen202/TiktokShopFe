export const permission = {
  ADMIN: 0, // Admin
  MANAGER: 1, // Manager
  SELLER: 2, // Seller
  DESIGNER: 3, // Designer
};

export const permissionMap = {
  '/': [permission.ADMIN, permission.MANAGER, permission.SELLER, permission.DESIGNER],
  '/shops': [permission.ADMIN, permission.MANAGER, permission.SELLER],
  '/templates': [permission.ADMIN, permission.MANAGER, permission.SELLER],
  '/users': [permission.ADMIN, permission.MANAGER],
  '/crawl': [permission.ADMIN, permission.MANAGER, permission.SELLER],
  '/google-trends': [permission.ADMIN, permission.MANAGER, permission.SELLER],
  '/design-editor': [permission.ADMIN, permission.MANAGER, permission.DESIGNER],
  '/check-label': [permission.ADMIN, permission.MANAGER, permission.SELLER],
  '/design-sku': [permission.ADMIN, permission.MANAGER, permission.DESIGNER],
  '/artwork': [permission.ADMIN, permission.MANAGER, permission.DESIGNER, permission.SELLER],
};
