from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, PublicUserViewSet, UserViewSet

CustomRouter = DefaultRouter()
CustomRouter.register(r"products", ProductViewSet)
CustomRouter.register(r"users", UserViewSet)
CustomRouter.register(r"users/public", PublicUserViewSet)
