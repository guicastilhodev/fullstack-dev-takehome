from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuoteViewSet, UserRegisterView, home,
    create_crm_customer, list_crm_customers,
    create_erp_order, list_erp_orders
)

router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('', home, name='home'),
    path('api/', include(router.urls)),
    path('api/register/', UserRegisterView.as_view(), name='user-register'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/crm/customers/', create_crm_customer, name='create-crm-customer'),
    path('api/crm/customers/list/', list_crm_customers, name='list-crm-customers'),
    path('api/erp/orders/', create_erp_order, name='create-erp-order'),
    path('api/erp/orders/list/', list_erp_orders, name='list-erp-orders'),
]