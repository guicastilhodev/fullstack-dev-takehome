
from django.db import models
from django.contrib.auth.models import User

class IntegrationLog(models.Model):
    ACTION_CHOICES = [
        ('ERP', 'ERP Integration'),
        ('CRM', 'CRM Integration'),
        ('STATUS', 'Status Change'),
    ]
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    quote = models.ForeignKey('Quote', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=20, choices=ACTION_CHOICES)
    status = models.CharField(max_length=50)
    payload = models.JSONField()
    response = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

class Quote(models.Model):
    opportunity_id = models.CharField(max_length=100)
    customer_name = models.CharField(max_length=255)
    customer_email = models.EmailField()
    customer_company = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=50,
        choices=[
            ('Pending Review', 'Pending Review'),
            ('Approved', 'Approved'),
            ('Rejected', 'Rejected'),
            ('Converted', 'Converted to Order')
        ],
        default='Pending Review'
    )
    supporting_document = models.FileField(upload_to='quotes/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_by = models.ForeignKey('auth.User', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.opportunity_id} - {self.customer_name}"