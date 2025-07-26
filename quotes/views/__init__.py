from .quotes import QuoteViewSet
from .crm import create_crm_customer, list_crm_customers
from .erp import create_erp_order, list_erp_orders
from .auth import UserRegisterView
from .home import home

__all__ = [
    "QuoteViewSet",
    "create_crm_customer",
    "list_crm_customers",
    "create_erp_order",
    "list_erp_orders",
    "UserRegisterView",
    "home",
]