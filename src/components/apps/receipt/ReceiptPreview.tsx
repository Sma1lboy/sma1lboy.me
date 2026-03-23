export default function ReceiptPreview() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div
        className="relative h-36 w-20 rounded-sm bg-[#faf8f2] p-2 font-mono text-[5px] leading-[7px] text-gray-800"
        style={{
          boxShadow: "2px 4px 12px rgba(0,0,0,0.15)",
          transform: "rotate(-2deg)",
        }}
      >
        <div className="mb-1 text-center text-[6px] font-bold">★ PIXEL MART ★</div>
        <div className="mb-1 border-t border-dashed border-gray-300" />
        <div className="space-y-[2px]">
          <div className="flex justify-between">
            <span>Dark Mode</span>
            <span>$4.04</span>
          </div>
          <div className="flex justify-between">
            <span>Semicolons</span>
            <span>$0.03</span>
          </div>
          <div className="flex justify-between">
            <span>Rubber Duck</span>
            <span>$12.00</span>
          </div>
          <div className="flex justify-between">
            <span>Regex</span>
            <span>$999</span>
          </div>
          <div className="flex justify-between">
            <span>node_modules</span>
            <span>$0.00</span>
          </div>
        </div>
        <div className="mt-1 border-t border-dashed border-gray-300" />
        <div className="mt-1 flex justify-between text-[6px] font-bold">
          <span>TOTAL:</span>
          <span>$NaN</span>
        </div>
        {/* Fake barcode */}
        <div className="mt-1 flex justify-center gap-[1px]">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="bg-gray-800"
              style={{
                width: Math.random() > 0.5 ? 2 : 1,
                height: 8,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
