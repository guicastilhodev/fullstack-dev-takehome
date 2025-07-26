from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from quotes.serializers import LoginSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_summary="Login with username and password (session auth)",
        request_body=LoginSerializer,
        responses={
            200: openapi.Response('Login successful', LoginSerializer),
            401: openapi.Response('Invalid credentials'),
        },
        tags=["Auth"]
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({'detail': 'Login successful.'}, status=status.HTTP_200_OK)
        return Response({'detail': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    @swagger_auto_schema(
        operation_summary="Logout (session auth)",
        responses={200: openapi.Response('Logout successful')},
        tags=["Auth"]
    )
    def post(self, request):
        logout(request)
        return Response({'detail': 'Logout successful.'}, status=status.HTTP_200_OK)
