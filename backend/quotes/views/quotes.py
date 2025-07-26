import requests
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Quote, IntegrationLog
from ..serializers import QuoteSerializer, QuoteFileUploadSerializer

from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


from rest_framework import mixins

class QuoteViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet
):
    serializer_class = QuoteSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Quote.objects.all().order_by('-created_at')
        return Quote.objects.filter(submitted_by=user).order_by('-created_at')

    def perform_create(self, serializer):
        quote = serializer.save(submitted_by=self.request.user)
        IntegrationLog.objects.create(
            user=self.request.user,
            quote=quote,
            action='CREATE',
            status=quote.status,
            payload=serializer.data,
            response={'message': 'Quote submitted successfully'}
        )

    @swagger_auto_schema(
        operation_summary="List quotes",
        operation_description="Returns a list of quotes. Sales users see their own quotes; admins see all quotes.",
        responses={200: QuoteSerializer(many=True)},
        tags=["Quotes"]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Retrieve a quote",
        operation_description="Retrieves the details of a specific quote by its ID.",
        responses={200: QuoteSerializer},
        tags=["Quotes"]
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_summary="Submit a new quote",
        operation_description="Submits a new quote for review. The user submitting the request will be marked as the owner.",
        request_body=QuoteSerializer,
        responses={201: QuoteSerializer},
        tags=["Quotes"]
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    @swagger_auto_schema(
        method='post',
        operation_summary="Upload a supporting document",
        operation_description="Uploads a file as a supporting document for an existing quote. This can be done by the quote owner or an admin.",
        request_body=QuoteFileUploadSerializer,
        responses={
            200: openapi.Response('File uploaded successfully', QuoteSerializer),
            400: 'Bad Request'
        },
        tags=["Quotes"]
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_file(self, request, pk=None):
        quote = self.get_object()
        if not (request.user.is_staff or quote.submitted_by == request.user):
            return Response({'error': 'You do not have permission to upload a file to this quote.'}, status=status.HTTP_403_FORBIDDEN)

        serializer = QuoteFileUploadSerializer(quote, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            IntegrationLog.objects.create(
                user=request.user,
                quote=quote,
                action='UPLOAD',
                status=quote.status,
                payload={'filename': request.data.get('supporting_document').name},
                response={'message': 'Supporting document uploaded'}
            )
            return Response(QuoteSerializer(quote).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @swagger_auto_schema(
        method='post',
        operation_summary="Set quote status (Admin only)",
        operation_description="Changes the status of a quote. This action is restricted to admin users. Valid statuses are 'Approved' and 'Rejected'. For conversions, other conditions apply.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['status'],
            properties={
                'status': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="New status for the quote. e.g., 'Approved', 'Rejected'",
                    enum=['Pending Review', 'Approved', 'Rejected', 'Converted to Order']
                ),
            },
        ),
        responses={
            200: openapi.Response('Status updated successfully', QuoteSerializer),
            400: 'Invalid status or missing requirements for conversion',
            403: 'Permission denied'
        },
        tags=["Quotes"]
    )
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser], parser_classes=[JSONParser])
    def set_status(self, request, pk=None):
        quote = self.get_object()
        new_status = request.data.get('status')
        allowed_statuses = [choice[0] for choice in quote._meta.get_field('status').choices]

        if new_status not in allowed_statuses:
            return Response({'error': f'Invalid status. Must be one of {allowed_statuses}'}, status=status.HTTP_400_BAD_REQUEST)

        old_status = quote.status

        if new_status == 'Converted to Order':
            if quote.status != 'Approved':
                return Response({'error': 'Quote must be approved before it can be converted.'}, status=status.HTTP_400_BAD_REQUEST)
            if not quote.supporting_document:
                return Response({'error': 'A supporting document is required for conversion.'}, status=status.HTTP_400_BAD_REQUEST)

        quote.status = new_status
        quote.save()

        log_entry = IntegrationLog.objects.create(
            user=request.user,
            quote=quote,
            action='STATUS',
            status=new_status,
            payload={'old_status': old_status, 'new_status': new_status},
            response={'message': 'Status changed successfully'}
        )

        if new_status in ['Approved', 'Converted to Order']:
            self._perform_mock_erp_integration(request.user, quote, log_entry)

        return Response(QuoteSerializer(quote).data, status=status.HTTP_200_OK)

    def _perform_mock_erp_integration(self, user, quote, log_entry):
        erp_url = 'http://localhost:8000/api/erp/orders/' 
        payload = {
            'quote_id': quote.id,
            'opportunity_id': quote.opportunity_id,
            'customer_name': quote.customer_name,
            'status': quote.status,
            'updated_at': quote.updated_at.isoformat(),
        }

        try:
            erp_response = requests.post(erp_url, json=payload, timeout=5)
            erp_response.raise_for_status() 
            erp_result = erp_response.json()
            log_action = 'ERP_SUCCESS'
        except requests.exceptions.RequestException as e:
            erp_result = {'error': str(e)}
            log_action = 'ERP_FAILURE'

        IntegrationLog.objects.create(
            user=user,
            quote=quote,
            action=log_action,
            status=quote.status,
            payload=payload,
            response=erp_result,
        )
