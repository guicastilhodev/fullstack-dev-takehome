from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import IntegrationLog
from ..serializers import IntegrationLogSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

class IntegrationLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = IntegrationLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return IntegrationLog.objects.all().order_by('-created_at')
        return IntegrationLog.objects.filter(user=user).order_by('-created_at')

    @swagger_auto_schema(
        operation_summary="List integration logs",
        operation_description="Returns a list of integration logs. Sales users see their own logs; admins see all logs.",
        responses={200: IntegrationLogSerializer(many=True)},
        tags=["Logs"]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve a log entry",
        operation_description="Retrieves the details of a specific log entry by its ID.",
        responses={200: IntegrationLogSerializer},
        tags=["Logs"]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        method='get',
        operation_summary="Get logs by quote ID",
        operation_description="Returns all logs associated with a specific quote.",
        responses={200: IntegrationLogSerializer(many=True)},
        tags=["Logs"]
    )
    @action(detail=False, methods=['get'])
    def by_quote(self, request):
        quote_id = request.query_params.get('quote_id')
        if not quote_id:
            return Response({'error': 'quote_id parameter is required'}, status=400)
        
        queryset = self.get_queryset().filter(quote_id=quote_id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @swagger_auto_schema(
        method='get',
        operation_summary="Get logs by action type",
        operation_description="Returns all logs filtered by action type (ERP, CRM, STATUS, etc.).",
        manual_parameters=[
            openapi.Parameter('action', openapi.IN_QUERY, description="Action type", type=openapi.TYPE_STRING, enum=['ERP', 'CRM', 'STATUS'])
        ],
        responses={200: IntegrationLogSerializer(many=True)},
        tags=["Logs"]
    )
    @action(detail=False, methods=['get'])
    def by_action(self, request):
        action = request.query_params.get('action')
        if not action:
            return Response({'error': 'action parameter is required'}, status=400)
        
        queryset = self.get_queryset().filter(action=action)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
