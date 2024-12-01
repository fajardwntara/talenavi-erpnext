frappe.ui.form.on('Sales Order', { 
    refresh: (frm) => {
        frm.add_custom_button(__("Generate Delivery Note"), function() {
			frappe.call({
                method: "frappe.client.insert",
                args: {
                    doc: {
                        doctype: "Delivery Note",
                        sales_order: frm.doc.name,
                        customer: frm.doc.customer,
                        items: frm.doc.items.map(item => ({
                            item_code: item.item_code,
                            qty: item.qty,
                            warehouse: item.warehouse
                        }))
                    }
                },
                callback: function(r) {
                    if (!r.exc) {
                        validate_delivery_note(frm);
                        frappe.show_alert({
                            message: __('Delivery Note successfully generated!'),
                            indicator: 'green'
                        })
                    }
                }
            });
		}).css({
            "color":"white", 
            "background-color": "#28a745", 
            "font-weight": "400"
        });

    },
    validate:  (frm)=> {
        validate_delivery_note(frm);
    },
});

const validate_delivery_note =  (frm) => {
    
    let shippingAddress = frm.doc.shipping_address 
    
    frappe.validated = false;

    if(shippingAddress == undefined || '' && frm.doc.custom_delivery_mode == 'Delivery') {
        frappe.throw(("Shipping Address is mandatory when Delivery Mode is 'Delivery'."))
    }else {
        frappe.call({
            method: "sales_order_custom.sales_order_custom.validate_delivery_mode.validate_delivery_mode",
            args: {
                p_delivery_mode: frm.doc.custom_delivery_mode,
                p_shipping_address: shippingAddress
            },
            callback: function(r) {
                if (r.message.status == "success") {
                    frappe.msgprint({
                        title: __('Grand Total'),
                        message: __(
                            `${r.message.message}!<br>The total amount for this Sales Order is <strong>${format_currency(frm.doc.grand_total, frm.doc.currency)}</strong>.`
                        ),
                        indicator: 'blue'
                    });
                    frappe.validated = true
                    
                } else {
                    frappe.throw((r.message.message));
                }
            }
        });
    }
}

