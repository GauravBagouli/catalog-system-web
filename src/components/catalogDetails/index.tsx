import { useEffect, useState, useMemo } from "react";
import type { Variant } from "../../stores/types/variant";
import type { Addon } from "../../stores/types/addon";

const ProductDetailPage = ({ productData }: any) => {
  const product = productData;

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedAttributes, setSelectedAttributes] = useState<
    Record<string, string>
  >({});
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const attributes = useMemo(() => {
    const attrMap: Record<string, Set<string>> = {};

    if (product?.Variants) {
      attrMap["size"] = new Set(product.Variants.map((v: Variant) => v.size));
      attrMap["color"] = new Set(product.Variants.map((v: Variant) => v.color));
    }

    return Object.fromEntries(
      Object.entries(attrMap).map(([k, set]) => [k, Array.from(set)])
    );
  }, [product]);

  useEffect(() => {
    if (product?.Variants?.length > 0) {
      const firstVariant = product.Variants?.[0];
      setSelectedVariant(firstVariant);
      setSelectedAttributes({
        size: firstVariant.size,
        color: firstVariant.color,
      });
      setSelectedImage(product.product_images?.[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product && Object.keys(selectedAttributes).length > 0) {
      const match = product.Variants.find((v: Variant) => {
        return Object.entries(selectedAttributes).every(([key, value]) => {
          if (key === "size") return v.size === value;
          if (key === "color") return v.color === value;
          return false;
        });
      });

      setSelectedVariant(match || null);
    }
  }, [selectedAttributes, product]);

  const toggleAddOn = (name: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(name) ? prev.filter((a) => a !== name) : [...prev, name]
    );
  };

  const finalPrice = useMemo(() => {
    const basePrice = selectedVariant?.price || 0;
    const addOnTotal = (product?.Addons || [])
      .filter((addon: Addon) => selectedAddOns.includes(addon.name))
      .reduce((sum: any, addon: { price: any }) => sum + addon.price, 0);
    return (basePrice + addOnTotal) * quantity;
  }, [selectedVariant, selectedAddOns, quantity, product?.Addons]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-16">
      {/* Left: Images */}
      <div>
        <img
          src={selectedImage}
          alt={product?.name}
          className="w-full max-h-[48vh] object-cover rounded-lg shadow"
        />
        <div className="flex gap-4 mt-4">
          {product?.product_images?.map((img: string, idx: number) => (
            <img
              key={idx}
              src={img}
              alt={`Thumbnail ${idx}`}
              className={`w-24 h-24 object-cover rounded-lg cursor-pointer border-2 ${
                selectedImage === img ? "border-blue-500" : "border-transparent"
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div>
        <h1 className="text-3xl font-bold">{product?.name}</h1>
        <p className="text-gray-400 mt-1">Type: {product?.ProductType?.name}</p>

        {/* Price, SKU & Stock */}
        <div className="mt-4 space-y-1">
          <p className="text-2xl font-semibold">₹{finalPrice}</p>
          <p className="text-sm text-gray-400 italic">
            (Base: ₹{selectedVariant?.price ?? "N/A"})
          </p>
          <p className="text-gray-400">SKU: {selectedVariant?.sku ?? "N/A"}</p>
          <p
            className={`font-medium ${
              selectedVariant && selectedVariant?.stock > 0
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            Stock: {selectedVariant?.stock ?? 0}
          </p>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-400">{product?.description}</p>

        {/* Attribute Selection */}
        {Object.entries(attributes).map(([attrName, values]) => (
          <div key={attrName} className="mt-6">
            <h3 className="font-semibold mb-2 capitalize">{attrName}</h3>
            <div className="flex flex-wrap gap-3">
              {values.map((val) => (
                <button
                  key={val}
                  onClick={() => {
                    setSelectedAttributes((prev) => ({
                      ...prev,
                      [attrName]: val,
                    }));
                    setSelectedVariant(null);
                    setQuantity(1);
                    setSelectedAddOns([]);
                  }}
                  className={`px-4 py-2 rounded-lg border ${
                    selectedAttributes[attrName] === val
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-800 border-gray-300"
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Add-ons */}
        {product?.Addons?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Add-ons</h3>
            <div className="flex flex-col gap-2">
              {product?.Addons?.map((addon: Addon) => (
                <label
                  key={addon.id}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAddOns?.includes(addon?.name)}
                    onChange={() => toggleAddOn(addon?.name)}
                  />
                  {addon?.name} (+₹{addon?.price})
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1"
            >
              -
            </button>
            <span className="px-4">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className={`px-3 py-1 ${
                quantity >= (selectedVariant?.stock || 0)
                  ? "text-gray-400 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                !selectedVariant || quantity >= selectedVariant?.stock || false
              }
            >
              +
            </button>
          </div>
          <button
            disabled={
              !selectedVariant || quantity >= selectedVariant?.stock || false
            }
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
