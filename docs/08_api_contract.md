# API Contract (Mock – MSW)  

The mock server (`src/mocks/*.ts`) implements a tiny REST‑like surface that the React UI consumes. All endpoints return JSON and simulate realistic latency (≈ 300 ms) to exercise loading states.

## 1️⃣ `GET /api/products`

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page`    | number | optional (default 1) | 1‑based page index. |
| `limit`   | number | optional (default 2) | Number of items per page – matches the UI design of **2 items per page** [1]. |

**Request**  

```
GET /api/products?page=1&limit=2
```

**Response – 200 OK**

```json
{
  "page": 1,
  "limit": 2,
  "total": 5,                     // total mock products
  "products": [                    // array of Product objects (see data model)
    { "id": "p1", "name": "...", "shortDescription": "...", "description": "...", "priceCents": 1999, "imageUrl": "/assets/images/p1.png" },
    { "id": "p2", "name": "...", "shortDescription": "...", "description": "...", "priceCents": 2499, "imageUrl": "/assets/images/p2.png" }
  ]
}
```

**Error – 400 Bad Request** (e.g., non‑numeric pagination values)  

```json
{ "error": "Invalid pagination parameters" }
```

**Latency simulation** – MSW introduces a `delay(300)` to mimic a modest network round‑trip, useful for the loading spinner on the Home page.

---

## 2️⃣ `POST /api/checkout`

Used by the **Checkout – Payment Mock** (FR‑6) [3] and **Shipping Mock** (FR‑7) [2].

**Request Body**

```json
{
  "items": [
    { "productId": "p1", "quantity": 2 }
  ],
  "shipping": {
    "name": "Jane Doe",
    "address": "123 Main St",
    "city": "Springfield",
    "zip": "12345",
    "country": "USA"
  }
}
```

*All fields are required; price information is looked up server‑side from the mock product list to avoid client tampering.*

**Response – 201 Created**

```json
{
  "orderId": "ORD-20230708-001",
  "items": [
    { "productId": "p1", "name": "Acme Widget", "priceCents": 1999, "quantity": 2 }
  ],
  "totalCents": 3998,
  "shipping": { "name": "Jane Doe", "address": "123 Main St", "city": "Springfield", "zip": "12345", "country": "USA" },
  "trackingNumber": "TRK-7F3A9B"
}
```

**Response – 400 Bad Request** (validation failures)  

```json
{ "error": "Shipping address incomplete" }
```

**Response – 500 Internal Server Error** (simulated failure; used in integration tests)  

```json
{ "error": "Payment processing failed" }
```

**Latency simulation** – The mock handler delays for **1 second** before returning success, matching the UI requirement that the **Pay now** button shows a spinner for 1 s [3].

---

### General Notes  

* The API is **stateless** – checkout does not persist anything beyond the response, satisfying **FR‑9** (no persistent history) [2].  
* All responses obey the **Content‑Type: application/json** header.  
* The contract is deliberately tiny because the real back‑end is out of scope; the Frontend Engineer can replace the MSW layer with a real service without breaking the UI.

---