from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Import các views module
import api.views.google_trend as google_trend
import api.views.tiktok as tiktok
from api.utils.flashship import flashshipapi

swagger_urls = [
    path("schema", SpectacularAPIView.as_view(), name="schema"),
    path("schema/swagger-ui", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]

auth_urls = [
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup", tiktok.auth_action.SignUp.as_view(), name="signup"),
    path("verify/<str:uidb64>/<str:token>", tiktok.auth_action.Verify.as_view(), name="verify"),
]

shop_urls = [
    path("shops", tiktok.shop_action.Shops.as_view(), name="manipulate_shops_info"),
    path("shops/list", tiktok.shop_action.ShopList.as_view(), name="product_lists_each_user"),
    path("shops/lists", tiktok.shop_action.ShopListAPI.as_view(), name="product_lists_all_user"),
    path("shops/<int:shop_id>", tiktok.shop_action.ShopDetail.as_view(), name="shop_put_get_delete"),
    path("shops/<int:shop_id>/refreshtoken", tiktok.token_action.RefreshToken.as_view(), name="refresh_token"),
    path("shops/<int:shop_id>/products/<int:product_id>",
         tiktok.product_action.ProductDetail.as_view(), name="product_detail"),
    path("shops/<int:shop_id>/products/list/page=<int:page_number>",
         tiktok.product_action.ListProduct.as_view(), name="product_list"),
    path("shops/<int:shop_id>/categories", tiktok.product_action.CategoriesByShopId.as_view(), name="categories"),
    path("shops/<int:shop_id>/warehouses", tiktok.product_action.WareHouse.as_view(), name="wareHouse"),
    path("shops/<int:shop_id>/attributes", tiktok.product_action.Attributes.as_view(), name="attributes"),
    path("shops/search", tiktok.shop_action.ShopSearchViews.as_view(), name="shop_search"),
    path("shops/<int:shop_id>/upload", tiktok.product_action.UploadImage.as_view(), name="upload_images"),
    path('shops/<int:shop_id>/brands', tiktok.product_action.GetAllBrands.as_view(), name='get_brands'),
    path("shops/<int:shop_id>/categories/is_leaf", tiktok.product_action.CategoriesIsLeaf.as_view(), name="categories_is_leaf"),
    path('shops/<int:shop_id>/products/create_product_excel3',
         tiktok.product_action.ProcessExcel.as_view(), name='process_excel_for_batch_create_products'),

    path('shops/<int:shop_id>/products/update_product/<int:product_id>',
         tiktok.product_action.EditProduct.as_view(), name='edit_product'),
    path('shops/<int:shop_id>/orders/list', tiktok.order_action.ListOrder.as_view(), name='order_list'),
    path('shops/<int:shop_id>/orders/detail', tiktok.order_action.OrderDetail.as_view(), name='order_detail'),
    path('shops/<int:shop_id>/products/create_product',
         tiktok.product_action.CreateOneProduct.as_view(), name='create_one_product'),
    path('shops/<int:shop_id>/buy_lebal', tiktok.order_action.ShippingLabel.as_view(), name='buy_shipping_label'),
    path('shops/<int:shop_id>/categories/<int:category_id>/products/get_attribute',
         tiktok.product_action.GetProductAttribute.as_view(), name='get_product_att'),
    path('shops/<int:shop_id>/products/create_product_draf',
         tiktok.product_action.CreateOneProductDraf.as_view(), name='create_one_product_draf')
]

template_urls = [
    path('templates', tiktok.template_action.TemplateList.as_view(), name='template_list'),
    path('templates/<int:template_id>', tiktok.template_action.TemplateList.as_view(), name='template_detail'),
]

global_urls = [
    path("categories/global", tiktok.product_action.GlobalCategory.as_view(), name="global_categories"),
    path("brands/global", tiktok.product_action.GlobalBrand.as_view(), name="globals_brands"),
]

user_group_urls = [
    path("groups/change_user", tiktok.permission_action.PermissionRole.as_view(), name="divide_role"),
    path("groups/add_user_group", tiktok.permission_action.AddUserToGroup.as_view(), name="add_user_to_group"),
    path("groups/user_login_infor", tiktok.permission_action.InforUserCurrent.as_view(), name="user_current_infor"),
    path('user-shops/groups', tiktok.shop_action.UserShopList.as_view(), name='user_shops_list'),
    path('user/<int:user_id>/groups/infor', tiktok.permission_action.UserInfo.as_view(), name='user_group_infor'),
    path('groupcustoms/', tiktok.permission_action.GroupCustomListAPIView.as_view(), name='groupcustom_list'),
]

fulfillment_urls = [
    path('shops/<int:shop_id>/pre_combine_pkg', tiktok.order_action.AllCombinePackage.as_view(), name='pre_combine_pkg'),
    path('shops/<int:shop_id>/confirm_combine_pkg',
         tiktok.order_action.ConfirmCombinePackage.as_view(), name='confirm_combine_pkg'),
    path('shops/<int:shop_id>/category_recommend', tiktok.product_action.CategoryRecommend.as_view(), name='category_recommend'),
    path('shops/<int:shop_id>/shipping_service', tiktok.order_action.ShippingService.as_view(), name='shipping_service'),
    path('shops/<int:shop_id>/search_package', tiktok.order_action.SearchPackage.as_view(), name='search_package'),
    path('shops/<int:shop_id>/packages/package_detail', tiktok.order_action.PackageDetail.as_view(), name='package_detail'),
    path('shops/get_package_buyed', tiktok.order_action.PackageBought.as_view(), name='get_all_package_buyed'),
    path('pdf-search/', tiktok.order_action.PDFSearch.as_view(), name='pdf_search'),
    path('pdf-download/', tiktok.order_action.PDFDownload.as_view(), name='pdf_download'),
    path('shops/<int:shop_id>/packages/buy_label', tiktok.order_action.CreateLabel.as_view(), name='buy_label'),  # oke
    path('shops/<int:shop_id>/get_shipping_doc_package_ids',
         tiktok.order_action.ShippingDoc.as_view(), name='get_shipping_doc_package_ids'),  # oke

    path('designskus/', tiktok.order_action.DesignSkuListCreateAPIView.as_view(), name='designsku-list'),
    path('designskus/<int:pk>/', tiktok.order_action.DesignSkuDetailAPIView.as_view(), name='designsku-detail'),
    path('designskus/find_by_group/<int:group_id>',
         tiktok.order_action.DesignSkuDepartment.as_view(), name='designsku-find-by-group'),
    path('designskus/search/', tiktok.order_action.DesignSkuSearch.as_view(), name='designsku_search'),
    path('flashship/create', flashshipapi.SaveVariantDataFromExcel.as_view(), name='flashship_create'),
    path('flashship/all', flashshipapi.FlashShipPODVariantListView.as_view(), name='flashship_getall'),
    path('shops/upload_driver', tiktok.order_action.UploadDriver.as_view(), name='upload_driver'),
    path('shops/<int:shop_id>/orders/toship_infor', tiktok.order_action.ToShipOrderAPI.as_view(), name='to_ship_order'),
]


# Tách URLs ra thành các nhóm URLs nhỏ để dễ quản lý
urlpatterns = swagger_urls + auth_urls + shop_urls + template_urls + global_urls + user_group_urls + fulfillment_urls
