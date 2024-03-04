from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views_old

# Import các views module
import api.views.google_trend as google_trend
import api.views.tiktok as tiktok


# Tách URLs ra thành các nhóm URLs nhỏ để dễ quản lý
urlpatterns = [
    # Test API bằng Swagger
    path("schema", SpectacularAPIView.as_view(), name="schema"),
    path("schema/swagger-ui", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),

    # Authentication / Authorization
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup", tiktok.auth_action.SignUp.as_view(), name="signup"),
    path("verify/<str:uidb64>/<str:token>", tiktok.auth_action.Verify.as_view(), name="verify"),

    # SHOP CRUD
    path("shops", tiktok.shop_action.Shops.as_view(), name="shop_create"),
    #     path("shops/list", views_old.ShopList.as_view(), name="product_lists_for_admin"),
    #     path("shops/lists", views_old.ShopListAPI.as_view(), name="product_lists_for_users"),
    path("shops/<int:shop_id>", tiktok.shop_action.ShopDetail.as_view(), name="shop_put_get_delete"),
    path("shops/<int:shop_id>/refreshtoken", tiktok.token_action.RefreshToken.as_view(), name="refresh_token"),

    # List Product của Shop
    path("shops/<int:shop_id>/products/list/page=<int:page_number>",
         tiktok.product_action.ListProduct.as_view(), name="product_list"),

    # PRODUCT CRUD
    path("shops/<int:shop_id>/products/<int:product_id>",
         tiktok.product_action.ProductDetail.as_view(), name="product_detail"),

    # CATEGORY CRUD
    path("categories/global", tiktok.product_action.GlobalCategory.as_view(), name="global_categories"),

    path("shops/<int:shop_id>/categories", tiktok.product_action.CategoriesByShopId.as_view(), name="categories"),
    path("shops/<int:shop_id>/warehouses", tiktok.product_action.WareHouse.as_view(), name="WareHouse"),
    path("shops/<int:shop_id>/attributes", tiktok.product_action.Attributes.as_view(), name="Attributes"),
    path("shops/search", tiktok.shop_action.ShopSearchViews.as_view(), name="Shop_search"),
    path("shops/<int:shop_id>/upload", tiktok.product_action.UploadImage.as_view(), name="upload"),
    path('shops/<int:shop_id>/brands', tiktok.product_action.GetAllBrands.as_view(), name='get_brands'),
    path("shops/<int:shop_id>/categories/is_leaf", tiktok.product_action.CategoriesIsLeaf.as_view(), name="categories_is_leaf"),
    #     path('shops/<int:shop_id>/products/create_product_excel2',
    #          tiktok.product_action.MultithreadProcessExcel.as_view(), name='process_excel2'),
    #     path('shops/<int:shop_id>/products/create_product_excel1',
    #          views_old.ProcessExcelNo.as_view(), name='process_excel3'),
    #     path('shops/<int:shop_id>/products/create_product_excel3',
    #          tiktok.product_action.ProcessExcel.as_view(), name='process_excel1'),

    # TEMPLATE CRUD
    path('templates', tiktok.template_action.TemplateList.as_view(), name='template_list'),
    path('templates/<int:template_id>', tiktok.template_action.TemplateList.as_view(), name='template_detail'),


    path('shops/<int:shop_id>/products/update_product/<int:product_id>',
         tiktok.product_action.EditProductAPIView.as_view(), name='edit_product'),
    path('shops/<int:shop_id>/orders/list', tiktok.order_action.ListOrder.as_view(), name='order_list'),
    path('shops/<int:shop_id>/orders/detail', tiktok.order_action.OrderDetail.as_view(), name='order_detail'),
    path('shops/<int:shop_id>/products/create_product',
         tiktok.product_action.CreateOneProduct.as_view(), name='create_one_product'),
    path('shops/<int:shop_id>/buy_lebal', tiktok.order_action.ShippingLabel.as_view(), name='buy_shipping_label'),
    #     path('shops/upload_driver', views_old.UploadDriver.as_view(), name='upload_driver'),
    #     path('shops/orders/<str:order_id>/search_file', views_old.SearchPDF.as_view(), name='search_file'),
    #     path('shops/<int:shop_id>/orders/toship_infor', views_old.ToShipOrderAPI.as_view(), name='to_ship_order'),
    path(
        'shops/<int:shop_id>/categories/<int:category_id>/products/get_attribute',
        tiktok.product_action.GetProductAttribute.as_view(),
        name='get_product_att'
    ),
    path("brands/global", tiktok.product_action.GlobalBrand.as_view(), name="globals_brands"),
    path('shops/<int:shop_id>/products/create_product_draf',
         tiktok.product_action.CreateOneProductDraf.as_view(), name='create_one_product_draf'),
    path("groups/change_user", tiktok.permission_action.PermissionRole.as_view(), name="divide_role"),
    path("groups/user_login_infor", tiktok.permission_action.InforUserCurrent.as_view(), name="usercurrent_infor"),
    path('user-shops/groups', tiktok.shop_action.UserShopList.as_view(), name='user_shops_list'),
    path('user/<int:user_id>/groups/infor', tiktok.permission_action.UserInfo.as_view(), name='user_group_infor'),

    # For Fulfillment
    path('shops/<int:shop_id>/pre_combine_pkg', tiktok.order_action.AllCombinePackage.as_view(), name='pre_combine_pkg'),
    path('shops/<int:shop_id>/confirm_combine_pkg',
         tiktok.order_action.ConfirmCombinePackage.as_view(), name='confirm_combine_pkg'),
    path('shops/<int:shop_id>/category_recommend', tiktok.product_action.CategoryRecommend.as_view(), name='category_recommend'),
    path('shops/<int:shop_id>/shipping_service', tiktok.order_action.ShippingService.as_view(), name='shipping_service'),
    path('shops/<int:shop_id>/search_package', tiktok.order_action.SearchPackage.as_view(), name='search_package'),
    path('shops/<int:shop_id>/packages/<int:package_id>/package_detail',
         tiktok.order_action.PackageDetail.as_view(), name='package_detail')
]
