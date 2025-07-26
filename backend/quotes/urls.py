from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    QuoteViewSet, UserRegisterView, home,
    create_crm_customer, list_crm_customers,
    create_erp_order, list_erp_orders,
    IntegrationLogViewSet
)
from .views.auth_session import LoginView, LogoutView
from .views.user import UserInfoView

router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')
router.register(r'logs', IntegrationLogViewSet, basename='log')

urlpatterns = [
    path('', home, name='home'),
    path('api/', include(router.urls)),
    path('api/register/', UserRegisterView.as_view(), name='user-register'),
    path('api/user/', UserInfoView.as_view(), name='user-info'),
    path('api-auth/', include('rest_framework.urls')),
    path('api/crm/customers/', create_crm_customer, name='create-crm-customer'),
    path('api/crm/customers/list/', list_crm_customers, name='list-crm-customers'),
    path('api/erp/orders/', create_erp_order, name='create-erp-order'),
    path('api/erp/orders/list/', list_erp_orders, name='list-erp-orders'),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/logout/', LogoutView.as_view(), name='logout'),
]