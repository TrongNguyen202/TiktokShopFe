from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path("schema", SpectacularAPIView.as_view(), name="schema"),
    path("schema/swagger-ui", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup", views.SignUp.as_view(), name="signup"),
    path("verify/<str:uidb64>/<str:token>", views.Verify.as_view(), name="verify"),
    path("shops/<int:shop_id>/products/list", views.ListProduct.as_view(), name="product_list"),
    path("shops/list", views.ShopList.as_view(), name="product_listss"),
    path("shops", views.Shops.as_view(), name="Shops_create_list"),
    path("shops/<int:shop_id>", views.ShopDetail.as_view(), name="Shops_put_get_delete"),
    path("shops/<int:shop_id>/refreshtoken", views.RefreshToken.as_view(), name="refresh_token"),
    path("shops/<int:shop_id>/products/<int:product_id>", views.ProductDetail.as_view(), name="product_detail"),
    path("categories/global", views.GlobalCategory.as_view(), name="global_categories"),
    path("shops/<int:shop_id>/categories", views.CategoriesByShopId.as_view(), name="categories"),
    path("shops/<int:shop_id>/warehouses", views.WareHouse.as_view(), name="WareHouse"),
    path("shops/<int:shop_id>/attributes", views.Attributes.as_view(), name="Attributes"),
    path("shops/search", views.ShopSearchViews.as_view(), name="Shop_search"),
    path("shops/<int:shop_id>/upload", views.UploadImage.as_view(), name="upload"),
    path('shops/<int:shop_id>/brands', views.GetAllBrands.as_view(), name='get_brands'),
    path("shops/<int:shop_id>/categories/is_leaf", views.CategoriesIsleaf.as_view(), name="categories_is_leaf"),
    path('shops/<int:shop_id>/products/create_product_excel2', views.MultithreadProcessExcel.as_view(), name='process_excel2'),
    path('shops/<int:shop_id>/products/create_product_excel1', views.ProcessExcelNo.as_view(), name='process_excel3'),
    path('shops/<int:shop_id>/products/create_product_excel3', views.ProcessExcel.as_view(), name='process_excel1'),
    path('templates', views.TemplateList.as_view(), name='template_list'),
    path('templates/<int:template_id>', views.TemplateList.as_view(), name='template_detail'),    
    path('shops/<int:shop_id>/products/update_product/<int:product_id>', views.EditProductAPIView.as_view(), name='edit_product'),
    path('shops/<int:shop_id>/orders/list', views.ListOrder.as_view(), name='order_list'),
    path('shops/<int:shop_id>/orders/detail', views.OrderDetail.as_view(), name='order_detail'),
    path('shops/<int:shop_id>/products/create_product', views.CreateOneProduct.as_view(), name='create_one_product'),
    path('shops/<int:shop_id>/buy_lebal', views.ShippingLabel.as_view(), name='buy_shipping_label'),
    path('shops/upload_driver', views.UploadDriver.as_view(), name='upload_driver'),
    path('shops/orders/<str:order_id>/search_file', views.SearchPDF.as_view(), name='search_file'),
    path('shops/<int:shop_id>/orders/toship_infor', views.ToShipOrderAPI.as_view(), name='to_ship_order'),
    path(
    'shops/<int:shop_id>/categories/<int:category_id>/products/get_attribute',
    views.GetProductAttribute.as_view(),
    name='get_product_att'
),
    path("brands/global", views.GlobalBrand.as_view(), name="globals_brands"),
    path("brands/global", views.GlobalBrand.as_view(), name="globals_brands"),
    path('shops/<int:shop_id>/products/create_product_draf', views.CreateOneProductDraf.as_view(), name='create_one_product_draf'),
    path("groups/<int:group_custom_id>/permission", views.PermissionRole.as_view(), name="divide_role"),
    path('user-shops/groups', views.UserShopList.as_view(), name='user_shops_list')





    
]
