from rest_framework.serializers import (
    ModelSerializer,
    Serializer,
    EmailField,
    ValidationError,
)
from ..models import CartItem, Product
from django.contrib.auth import get_user_model

CustomUser = get_user_model()


class ProductSerializer(ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class CartItemSerializer(ModelSerializer):
    class Meta:
        model = CartItem
        fields = "__all__"


class UserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email", "password", "staff", "admin"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class PublicUserSerializer(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "email"]


class PasswordResetSerializer(Serializer):
    email = EmailField()

    def validate_email(self, value):
        if not CustomUser.objects.filter(email=value).exists():
            raise ValidationError("Email does not exist.")
        return value
