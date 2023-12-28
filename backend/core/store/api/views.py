from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken, TokenError
from rest_framework.permissions import IsAuthenticated

import django_filters

from ..models import CustomUser, Product, CartItem
from .serializers import (
    ProductSerializer,
    UserSerializer,
    PublicUserSerializer,
    CartItemSerializer,
    PasswordResetSerializer,
)

from functools import reduce
from operator import or_

from django.contrib.auth import get_user_model
from django.contrib.auth.forms import PasswordResetForm
from django.db.models import Q
from django.http import Http404
from django.db.models import Max, Min
from django.forms import ValidationError


class ProductViewSet(ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class ProductDetailView(APIView):
    def get_object(self, pk):
        try:
            return Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        item = self.get_object(pk)
        serializer = ProductSerializer(item)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        item = self.get_object(pk)
        serializer = ProductSerializer(item, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        item = self.get_object(pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductListView(generics.ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        django_filters.rest_framework.DjangoFilterBackend,
    ]
    search_fields = [
        "name",
        "description",
        "category",
    ]
    ordering_fields = ["price", "name"]

    def get_queryset(self):
        queryset = Product.objects.all()

        search_query = self.request.GET.get("q", None)
        ordering = self.request.GET.get("ordering", None)
        categories = self.request.GET.get("category", None)
        manufacturers = self.request.GET.get("manufacturer", None)
        price = self.request.GET.get("price", None)

        if search_query is not None:
            queryset = queryset.filter(
                Q(name__icontains=search_query)
                | Q(description__icontains=search_query)
                | Q(manufacturer__icontains=search_query)
            )

        if ordering is not None:
            queryset = queryset.order_by(ordering)

        if categories is not None:
            category_list = categories.split(",")
            category_filters = [
                Q(category__icontains=category) for category in category_list
            ]
            queryset = queryset.filter(reduce(or_, category_filters))

        if manufacturers is not None:
            manufacturer_list = manufacturers.split(",")
            manufacturer_filters = [
                Q(manufacturer__icontains=manufacturer)
                for manufacturer in manufacturer_list
            ]
            queryset = queryset.filter(reduce(or_, manufacturer_filters))

        if price is not None:
            price_list = price.split(",")

            if len(price_list) == 2:
                price_min, price_max = price_list[0], price_list[1]
                queryset = queryset.filter(price__range=(price_min, price_max))
            else:
                exact_price = price[0]
                queryset = queryset.filter(price=exact_price)

        if queryset is not None:
            return queryset
        else:
            return Response({"detail": "No matches found"})


class FiltersListView(APIView):
    def get(self, request, format=None):
        categories = list(Product.objects.values_list("category", flat=True).distinct())

        manufacturers = list(
            Product.objects.values_list("manufacturer", flat=True).distinct()
        )

        price_range = {
            "minPrice": Product.objects.aggregate(Min("price"))["price__min"],
            "maxPrice": Product.objects.aggregate(Max("price"))["price__max"],
        }

        return Response(
            {
                "categories": categories,
                "manufacturers": manufacturers,
                "price_range": price_range,
            }
        )


CustomUser = get_user_model()


class UserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


class PublicUserViewSet(ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = PublicUserSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"error": "User is already exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        email = request.data["email"]
        password = request.data["password"]

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if user is None:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST
            )
        if not user.check_password(password):
            return Response(
                {"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST
            )

        access_token = AccessToken.for_user(user)
        refresh_token = RefreshToken.for_user(user)
        return Response({"access": str(access_token), "refresh": str(refresh_token)})


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            return Response("Logout Successful", status=status.HTTP_200_OK)
        except TokenError:
            return Response(
                {"error": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST
            )


class RefreshAccessToken(APIView):
    def post(self, request):
        try:
            access_token = request.data["access"]
            if access_token:
                token = AccessToken(access_token)
            return Response(status=status.HTTP_200_OK)
        except TokenError:
            return Response(
                {"error": "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST
            )


class PasswordResetView(APIView):
    def post(self, request):
        try:
            serializer = PasswordResetSerializer(data=request.data)
            if serializer.is_valid():
                email = serializer.validated_data["email"]  # type: ignore

                try:
                    user = CustomUser.objects.get(email=email)
                except CustomUser.DoesNotExist:
                    return Response(
                        {"detail": "Email does not exist!"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                form = PasswordResetForm({"email": email})
                if form.is_valid():
                    request = self.request
                    form.save(
                        from_email="reset.mail.for.pet.project@gmail.com",
                        email_template_name="registration/password_reset_email.html",
                        request=request,  # type: ignore
                    )
                    return Response(
                        {"detail": "Password reset e-mail has been sent."},
                        status=status.HTTP_200_OK,
                    )
                else:
                    errors = form.errors.get_json_data()
                    return Response(errors["email"], status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class PasswordConfirmResetView(APIView):
    def post(self, request, *args, **kwargs):
        response_data = {"message": "Password reset successful."}
        return Response(response_data)


class CartAPI(generics.ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        user = self.request.user
        product_id = request.data.get("id")
        quantity = int(request.data.get("quantity", 1))  # type: ignore

        if not user:
            raise ValidationError("User must be authenticated.")

        if not product_id:
            raise ValidationError("Product ID is required.")

        try:
            cart, created = CartItem.objects.get_or_create(
                user=user, product_id=product_id, defaults={"quantity": quantity}
            )

            if not created:
                cart.quantity += quantity
                cart.save()
        except:
            raise ValidationError(str(Exception))

        serializer = CartItemSerializer(cart)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_total_price(self, queryset):
        total_price = sum(item.product.price * item.quantity for item in queryset)
        return total_price

    def get(self, request, *args, **kwargs):
        user = self.request.user
        queryset = CartItem.objects.filter(user=user)
        serializer = CartItemSerializer(queryset, many=True)

        total_price = self.get_total_price(queryset)

        response_data = {
            "cart_items": serializer.data,
            "total_price": total_price,
        }

        return Response(response_data, status=status.HTTP_200_OK)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
