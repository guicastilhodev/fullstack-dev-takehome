
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    method='post',
    operation_description="Simulate CRM customer creation. Accepts customer data as JSON.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='Customer name'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Customer email'),
        },
        required=['name', 'email']
    ),
    responses={200: openapi.Response('Customer received by CRM mock!')}
)
@api_view(['POST'])
def create_crm_customer(request):
    print('Payload received for CRM (create customer):', request.data)
    return Response({
        'message': 'Customer received by CRM mock!',
        'data': request.data
    }, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description="List mock CRM customers.",
    responses={200: openapi.Response('List of customers')}
)
@api_view(['GET'])
def list_crm_customers(request):
    customers = [
        {'id': 1, 'name': 'Customer 1', 'email': 'customer1@gmail.com'},
        {'id': 2, 'name': 'Customer 2', 'email': 'customer2@gmail.com'},
    ]
    return Response({'customers': customers}, status=status.HTTP_200_OK)
