import { fetchProducts, submitCheckout } from '../../api/client';

describe('fetchProducts', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches products from the API', async () => {
    const mockResponse = {
      page: 1,
          limit: 2,
          total: 5,
          products: [
            {
              id: 'p1',
              name: 'Acme Widget',
              shortDescription: 'Compact widget',
              description: 'Full description',
              priceCents: 1999,
              imageUrl: '/assets/images/p1.png',
            },
          ],
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    const data = await fetchProducts(1, 2);

    expect(fetch).toHaveBeenCalledWith('/api/products?page=1&limit=2');
    expect(data).toEqual(mockResponse);
  });
  it('throws an error when the request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });
    await expect(fetchProducts(1, 2)).rejects.toThrow('Failed to fetch products');
  });

  it('calls fetch with the correct URL for different page/limit', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          page: 2,
          limit: 5,
          total: 10,
          products: [],
        }),
});

    await fetchProducts(2, 5);

    expect(fetch).toHaveBeenCalledWith('/api/products?page=2&limit=5');
  });
});

describe('submitCheckout', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('posts checkout data and returns the order', async () => {
    const mockOrder = {
            orderId: 'ORD-123',
            items: [
              {
                productId: 'p1',
                name: 'Acme Widget',
                priceCents: 1999,
                quantity: 2,
              },
            ],
            totalCents: 3998,
            shipping: {
              name: 'Jane Doe',
              address: '123 Main St',
              city: 'Springfield',
              zip: '12345',
              country: 'USA',
            },
            trackingNumber: 'TRK-ABCDEF',
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrder),
    });

    const result = await submitCheckout({
      items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 }],
      shipping: {
        name: 'Jane Doe',
        address: '123 Main St',
        city: 'Springfield',
        zip: '12345',
        country: 'USA',
      },
    });

    expect(fetch).toHaveBeenCalledWith('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 2 }],
        shipping: {
          name: 'Jane Doe',
          address: '123 Main St',
          city: 'Springfield',
          zip: '12345',
          country: 'USA',
        },
      }),
  });
    expect(result.orderId).toBe('ORD-123');
    expect(result.totalCents).toBe(3998);
    expect(result.trackingNumber).toBe('TRK-ABCDEF');
  });

  it('throws an error when checkout fails with error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Invalid shipping' }),
    });
    await expect(
      submitCheckout({
        items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 1 }],
        shipping: { name: '', address: '', city: '', zip: '', country: '' },
      })
    ).rejects.toThrow('Invalid shipping');
  });

  it('throws generic error when checkout fails without error message', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({}),
});

    await expect(
      submitCheckout({
        items: [{ productId: 'p1', name: 'Acme Widget', priceCents: 1999, quantity: 1 }],
        shipping: { name: 'Jane', address: '123 St', city: 'City', zip: '123', country: 'US' },
      })
    ).rejects.toThrow('Checkout failed');
  });
});
