# Print Partner API

The **Teeinblue Print Partner API** lets **print partners** integrate their systems with the
**Teeinblue platform**. Through this API, partners synchronize **product catalogs**, **receive
and fulfill orders**, and **send shipment tracking updates** back to Teeinblue.

## Integration workflow

1. **Catalog synchronization**
   - Teeinblue retrieves your product data using `GET /catalogs` and `GET /catalogs/{id}`.
   - This information (mockups, print areas, variants, prices, ...) is shown to sellers on
     Teeinblue.
2. **Order submission**
   - When a seller places an order, Teeinblue calls `POST /orders` on your API with all order
     details (variant, shipping address, designs, ...).
   - The order payload includes a **`shipment_notification_url`** — you must store this URL for
     each order.
3. **Shipment notification**
   - Once the order is shipped, you send a `POST` request to the `shipment_notification_url`
     Teeinblue gave you. See [Shipment notification](/partner-api/shipment-notification).
   - Include tracking details (tracking number, tracking URL, carrier).
   - Teeinblue automatically updates the seller.

## Authentication

Every endpoint requires a Bearer token:

```
Authorization: Bearer YOUR_TOKEN
```

## Endpoints

These are the endpoints **you implement** and Teeinblue calls.

<ApiEndpoints spec="partner" prefix="/partner-api/" />
