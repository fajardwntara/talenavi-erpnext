import frappe
from frappe import _

@frappe.whitelist()
def validate_delivery_mode(p_delivery_mode, p_shipping_address):
    if p_delivery_mode == 'Delivery' and not p_shipping_address:
        return {
            "status": "error",
            "message": "Shipping Address is mandatory when Delivery Mode is 'Delivery'."
        }
    else:
        return {
            "status": "success",
            "message": "Success"
        }