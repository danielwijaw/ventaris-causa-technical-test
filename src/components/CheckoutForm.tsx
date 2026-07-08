import { useState } from 'react';
import type { ShippingInfo } from '../types';

interface CheckoutFormProps {
  onSubmit: (shipping: ShippingInfo) => void;
  isSubmitting: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting }: CheckoutFormProps) {
  const [form, setForm] = useState<ShippingInfo>({
    name: '',
    address: '',
    city: '',
    zip: '',
    country: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingInfo, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingInfo, string>> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.address.trim()) newErrors.address = 'Address is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.zip.trim()) newErrors.zip = 'ZIP code is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(form);
    }
  };

  const handleChange = (field: keyof ShippingInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const inputClass = (field: keyof ShippingInfo) =>
    `w-full rounded-lg border px-3 py-2.5 text-sm text-[#212529] bg-[#F8F9FA] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/20 transition-colors ${
      errors[field] ? 'border-[#DC3545]' : 'border-[#CED4DA] focus:border-[#0D6EFD]'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#212529] mb-1">
          Full Name
        </label>
        <input
          id="name"
          type="text"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className={inputClass('name')}
          placeholder="Jane Doe"
        />
        {errors.name && <p className="mt-1 text-xs text-[#DC3545]">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#212529] mb-1">
          Address
        </label>
        <input
          id="address"
          type="text"
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className={inputClass('address')}
          placeholder="123 Main St"
        />
        {errors.address && <p className="mt-1 text-xs text-[#DC3545]">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-[#212529] mb-1">
            City
          </label>
          <input
            id="city"
            type="text"
            value={form.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className={inputClass('city')}
            placeholder="Springfield"
          />
          {errors.city && <p className="mt-1 text-xs text-[#DC3545]">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="zip" className="block text-sm font-medium text-[#212529] mb-1">
            ZIP Code
          </label>
          <input
            id="zip"
            type="text"
            value={form.zip}
            onChange={(e) => handleChange('zip', e.target.value)}
            className={inputClass('zip')}
            placeholder="12345"
          />
          {errors.zip && <p className="mt-1 text-xs text-[#DC3545]">{errors.zip}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-[#212529] mb-1">
          Country
        </label>
        <input
          id="country"
          type="text"
          value={form.country}
          onChange={(e) => handleChange('country', e.target.value)}
          className={inputClass('country')}
          placeholder="USA"
        />
        {errors.country && <p className="mt-1 text-xs text-[#DC3545]">{errors.country}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#0D6EFD] px-4 py-3 text-sm font-medium text-white hover:bg-[#0B5ED7] focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]/50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}
