from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [
    path("schema", SpectacularAPIView.as_view(), name="schema"),
    path(
        "schema/swagger-ui",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("login", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup", views.SignUp.as_view(), name="signup"),
    path("verify/<str:uidb64>/<str:token>", views.Verify.as_view(), name="verify"),
    path("shops/<int:shop_id>/products/list", views.ListProduct.as_view(), name="product_list"),
    path("shops", views.Shops.as_view(), name="Shops_create_list"),
    path("shops/<int:shop_id>", views.ShopDetail.as_view(), name="Shops_put_get_delete"),
    path("shops/refreshtoken", views.RefreshToken.as_view(), name="refresh_token"),
    path("shops/<int:shop_id>/products/<int:product_id>", views.ProductDetail.as_view(), name="product_detail"),
    path("shops/<int:shop_id>/categories", views.Categories.as_view(), name="categories"),
    path("shops/<int:shop_id>/warehouses", views.WareHouse.as_view(), name="WareHouse"),
    path("shops/search", views.ShopSearchViews.as_view(), name="Shop_search"),
    path("shops/<int:shop_id>/upload", views.UploadImage.as_view(), name="upload"),
 
]
