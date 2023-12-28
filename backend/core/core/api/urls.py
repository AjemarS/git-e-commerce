from rest_framework.routers import DefaultRouter
from store.api.views import (
    CartItemDetailView,
    ProductDetailView,
    RefreshAccessToken,
    RegisterView,
    LoginView,
    LogoutView,
    PasswordResetView,
    ProductListView,
    FiltersListView,
    CartAPI,
)
from store.api.urls import CustomRouter
from django.urls import path, include
from django.contrib.auth.views import (
    PasswordResetConfirmView,
    PasswordResetDoneView,
    PasswordResetCompleteView,
)

router = DefaultRouter()
router.registry.extend(CustomRouter.registry)

urlpatterns = [
    path("", include(router.urls)),
    path(
        "products/<int:product_id>/", ProductDetailView.as_view(), name="product_detail"
    ),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("token/refresh/", RefreshAccessToken.as_view(), name="refresh_access_token"),
    path(
        "password_reset/",
        PasswordResetView.as_view(),
        name="password_reset",
    ),
    path(
        "password_reset/done/",
        PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "reset/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "reset/done/",
        PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path("products", ProductListView.as_view(), name="product_filtering"),
    path(
        "products-data/filters/",
        FiltersListView.as_view(),
        name="products_filters_list",
    ),
    path("cart/", CartAPI.as_view(), name="cart"),
    path("cart/<int:pk>/", CartItemDetailView.as_view(), name="cart-detail"),
]
