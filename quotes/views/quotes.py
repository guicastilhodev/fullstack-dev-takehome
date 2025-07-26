import requests
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Quote, IntegrationLog
from ..serializers import QuoteSerializer, QuoteFileUploadSerializer

from rest_framework.parsers import MultiPartParser, FormParser
from drf_yasg.utils import swagger_auto_schema


from rest_framework import mixins

class QuoteViewSet(mixins.CreateModelMixin,
                   mixins.RetrieveModelMixin,
                   mixins.ListModelMixin,
                   viewsets.GenericViewSet):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        method='post',
        request_body=QuoteFileUploadSerializer,
        operation_description="Upload a supporting document for a quote.",
        responses={200: QuoteFileUploadSerializer},
        manual_parameters=[],
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], parser_classes=[MultiPartParser, FormParser])
    def upload_file(self, request, pk=None):
        quote = self.get_object()
        serializer = QuoteFileUploadSerializer(quote, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            IntegrationLog.objects.create(
                user=request.user,
                quote=quote,
                action='STATUS',
                status=quote.status,
                payload={'supporting_document': str(quote.supporting_document)},
                response={'message': 'Supporting document uploaded'}
            )
            return Response({'status': 'File uploaded successfully.', 'file': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class QuoteViewSet(viewsets.ModelViewSet):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Quote.objects.all()
        return Quote.objects.filter(submitted_by=user)

    def perform_create(self, serializer):
        quote = serializer.save(submitted_by=self.request.user)
        IntegrationLog.objects.create(
            user=self.request.user,
            quote=quote,
            action='STATUS',
            status=quote.status,
            payload={
                'opportunity_id': quote.opportunity_id,
                'customer_name': quote.customer_name,
                'customer_email': quote.customer_email,
                'customer_company': quote.customer_company,
            },
            response={'message': 'Quote submitted'}
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def set_status(self, request, pk=None):
        quote = self.get_object()
        new_status = request.data.get('status')
        allowed_status = ['Approved', 'Rejected', 'Converted', 'Converted to Order']
        if new_status not in allowed_status:
            return Response({'error': 'Invalid status.'}, status=status.HTTP_400_BAD_REQUEST)
        old_status = quote.status
        quote.status = new_status
        quote.save()

        IntegrationLog.objects.create(
            user=request.user,
            quote=quote,
            action='STATUS',
            status=new_status,
            payload={'old_status': old_status, 'new_status': new_status},
            response={'message': 'Status changed'}
        )

        if new_status in ['Approved', 'Converted', 'Converted to Order']:
            erp_url = 'http://localhost:8000/api/erp/orders/'
            payload = {
                'id': quote.id,
                'opportunity_id': quote.opportunity_id,
                'customer_name': quote.customer_name,
                'customer_email': quote.customer_email,
                'customer_company': quote.customer_company,
                'status': quote.status,
                'created_at': str(quote.created_at),
                'updated_at': str(quote.updated_at),
            }
            try:
                erp_response = requests.post(erp_url, json=payload, timeout=5)
                erp_result = erp_response.json()
            except Exception as e:
                erp_result = {'error': str(e)}
            IntegrationLog.objects.create(
                user=request.user,
                quote=quote,
                action='ERP',
                status=quote.status,
                payload=payload,
                response=erp_result
            )
            return Response({'status': quote.status, 'erp_result': erp_result})

        return Response({'status': quote.status})
