
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth.models import User
from .models import Quote
from io import BytesIO
from django.core.files.uploadedfile import SimpleUploadedFile

class QuoteFileUploadTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.login(username='testuser', password='testpass')
        self.quote = Quote.objects.create(
            opportunity_id='OPP-1',
            customer_name='Customer',
            customer_email='customer@email.com',
            customer_company='Company',
            submitted_by=self.user
        )

    def test_upload_valid_file(self):
        url = reverse('quote-upload-file', args=[self.quote.id])
        file = SimpleUploadedFile('test.pdf', b'filecontent', content_type='application/pdf')
        response = self.client.post(url, {'supporting_document': file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('File uploaded successfully.', response.data['status'])

    def test_upload_invalid_type(self):
        url = reverse('quote-upload-file', args=[self.quote.id])
        file = SimpleUploadedFile('test.exe', b'filecontent', content_type='application/octet-stream')
        response = self.client.post(url, {'supporting_document': file}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('File type not allowed.', str(response.data))
