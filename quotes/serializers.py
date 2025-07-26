from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Quote


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = [
            'id',
            'opportunity_id',
            'customer_name',
            'customer_email',
            'customer_company',
            'supporting_document',
            'created_at',
            'updated_at',
            'submitted_by',
            'status',
        ]
        read_only_fields = ['status', 'created_at', 'updated_at', 'submitted_by', 'id']


class QuoteFileUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = ['supporting_document']

    def validate_supporting_document(self, value):
        max_size = 5 * 1024 * 1024  
        allowed_types = [
            'application/pdf',
            'image/jpeg',
            'image/png',
        ]
        if value.size > max_size:
            raise serializers.ValidationError('File too large (max 5MB).')
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('File type not allowed.')
        return value


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], password=validated_data['password'], email=validated_data.get('email', ''))
        return user