from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView
from .views import *

urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("login/", CookieTokenObtainPairView.as_view(), name="login"),
    path("refresh/", CookieTokenRefreshView.as_view(), name="refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token-verify"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path("resend-verification/", ResendVerificationEmailView.as_view(), name="resend-verification"),
    path("user/<int:pk>/", UserDetailView.as_view(), name="user-detail"),
    path("current-user/", CurrentUserView.as_view(), name="current-user"),
    path("register-shop-owner/", RegisterShopOwnerView.as_view(), name="register-shop-owner"),
    path("register-supplier/", RegisterSupplierView.as_view(), name="register-supplier"),
    path("register-courier/", RegisterCourierView.as_view(), name="register-courier"),
    path("create-payment-method/", CreatePaymentMethodView.as_view(), name="create-payment-method"),
]