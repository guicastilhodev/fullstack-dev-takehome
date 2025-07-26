
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    method='post',
    operation_description="Simulate ERP order creation. Accepts order data as JSON.",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'customer': openapi.Schema(type=openapi.TYPE_STRING, description='Customer name'),
            'total': openapi.Schema(type=openapi.TYPE_NUMBER, description='Order total'),
            'status': openapi.Schema(type=openapi.TYPE_STRING, description='Order status'),
        },
        required=['customer', 'total', 'status']
    ),
    responses={200: openapi.Response('Order received by ERP mock!')}
)
@api_view(['POST'])
def create_erp_order(request):
    print('Payload received for ERP:', request.data)
    return Response({
        'message': 'Order received by ERP mock!',
        'data': request.data
    }, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    operation_description="List mock ERP orders.",
    responses={200: openapi.Response('List of orders')}
)
@api_view(['GET'])
def list_erp_orders(request):
    orders = [
        {'id': 1, 'customer': 'Customer 1', 'total': 1000, 'status': 'Approved'},
        {'id': 2, 'customer': 'Customer 2', 'total': 500, 'status': 'Pending Review'},
    ]
    return Response({'orders': orders}, status=status.HTTP_200_OK)
