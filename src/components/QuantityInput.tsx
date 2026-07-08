interface QuantityInputProps {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function QuantityInput({
  quantity,
  onDecrease,
  onIncrease,
  onChange,
  min = 1,
  max = 99,
}: QuantityInputProps) {
  return (
    <div className="flex items-center border border-[#CED4DA] rounded-lg overflow-hidden">
      <button
        onClick={onDecrease}
        disabled={quantity <= min}
        className="px-3 py-1.5 text-sm font-medium text-[#212529] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          if (!isNaN(val) && val >= min && val <= max) {
            onChange(val);
          }
        }}
        className="w-12 text-center text-sm py-1.5 border-x border-[#CED4DA] bg-white text-[#212529] focus:outline-none"
        min={min}
        max={max}
        aria-label="Quantity"
      />
      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="px-3 py-1.5 text-sm font-medium text-[#212529] hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
