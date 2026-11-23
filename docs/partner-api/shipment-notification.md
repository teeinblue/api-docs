# Shipment notification

When you (the print partner) fulfill an order, you need to notify **Teeinblue** about the
shipment details.

After the order is shipped, your system sends a `POST` request to the **shipment notification
URL** that **Teeinblue provided to you** when the order was created
(`shipment_notification_url` in the `POST /orders` payload). This allows Teeinblue to update
the seller with the tracking details automatically.

## Notification payload format

The request body is JSON and includes the following fields:

```json
{
  "id": "text",
  "reference_order_id": "text",
  "order_id": "text",
  "tracking_number": "text",
  "tracking_url": "https://example.com",
  "tracking_company": "text"
}
```
