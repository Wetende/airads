from django.urls import path

from . import views

app_name = "commerce"

urlpatterns = [
    path("programs/<int:pk>/checkout/", views.program_checkout, name="checkout"),
    path("programs/<int:pk>/checkout/initialize/", views.program_checkout_initialize, name="checkout_initialize"),
    path("payments/paystack/callback/", views.paystack_callback, name="paystack_callback"),
    path("webhooks/paystack/", views.paystack_webhook, name="paystack_webhook"),
    path("student/orders/", views.student_orders, name="student_orders"),
]
