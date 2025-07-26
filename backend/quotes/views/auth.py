from rest_framework import generics, permissions
from django.contrib.auth.models import User
from ..serializers import UserRegisterSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="Register a new user",
        request_body=UserRegisterSerializer,
        responses={
            201: openapi.Response('User created', UserRegisterSerializer),
            400: 'Validation error',
        },
        tags=["Auth"]
    )
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)
