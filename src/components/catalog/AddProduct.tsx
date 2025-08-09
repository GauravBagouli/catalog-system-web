import { useEffect, useState } from "react";
import API from "../../helpers/api";
import type { ProductType } from "../../stores/types/product";
import { encodeData } from "../../helpers/auth";
import toast from "react-hot-toast";
import { Trash2 } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface Addon {
  name: string;
  price: number | string;
}

interface Variant {
  size: string;
  color: string;
  price: number | string;
  stock: number | string;
  sku: string;
}

const AddProductForm = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>();
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [addons, setAddons] = useState<Addon[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);

  const selectedProductType = productTypes.find(
    (pt) => parseInt(pt.id) === selectedProductTypeId
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!selectedProductTypeId) {
      toast.error("Please select a product type");
      return;
    }

    if (selectedProductType?.name?.toLowerCase() === "food") {
      for (let i = 0; i < addons.length; i++) {
        if (!addons[i].name.trim()) {
          toast.error(`Addon ${i + 1}: name is required`);
          return;
        }
        if (addons[i].price === "" || Number(addons[i].price) < 0 || isNaN(Number(addons[i].price))) {
          toast.error(`Addon ${i + 1}: price must be a valid number`);
          return;
        }
      }
    }

    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.size.trim()) {
        toast.error(`Variant ${i + 1}: size is required`);
        return;
      }
      if (!v.color.trim()) {
        toast.error(`Variant ${i + 1}: color is required`);
        return;
      }
      if (v.price === "" || isNaN(Number(v.price)) || Number(v.price) < 0) {
        toast.error(`Variant ${i + 1}: price must be a valid number`);
        return;
      }
      if (v.stock === "" || isNaN(Number(v.stock)) || Number(v.stock) < 0) {
        toast.error(`Variant ${i + 1}: stock must be a valid number`);
        return;
      }
    }

    const normalizedAddons = addons.map((a) => ({
      name: a.name.trim(),
      price: Number(a.price),
    }));

    const normalizedVariants = variants.map((v) => ({
      size: v.size.trim(),
      color: v.color.trim(),
      price: Number(v.price),
      stock: Number(v.stock),
      sku: v.sku.trim(),
    }));

    const formData = {
      name: name.trim(),
      description,
      status,
      product_type_id: selectedProductTypeId,
      product_images: base64Images,
      addons: selectedProductType?.name?.toLowerCase() === "food" ? normalizedAddons : [],
      variants: normalizedVariants,
    };

    const payload = encodeData(formData);

    API.apiPost(
      "addProduct",
      { payload: payload },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then(() => {
        toast.success("Product added successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Failed to add product");
      });

    onClose();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newBase64s: string[] = [];
    const newPreviews: string[] = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        newBase64s.push(base64);
        newPreviews.push(base64);

        if (newBase64s.length === files.length) {
          setBase64Images((prev) => [...prev, ...newBase64s]);
          setPreviewUrls((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setBase64Images((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const addAddon = () => setAddons((s) => [...s, { name: "", price: "" }]);
  const removeAddon = (index: number) => setAddons((s) => s.filter((_, i) => i !== index));
  const handleAddonChange = (index: number, field: keyof Addon, value: string | number) => {
    setAddons((prev) => {
      const updated = [...prev];
      if (field === "price") {
        updated[index] = { ...updated[index], price: value === "" ? "" : Number(value) };
      } else {
        updated[index] = { ...updated[index], [field]: String(value) };
      }
      return updated;
    });
  };

  const addVariant = () => setVariants((s) => [...s, { size: "", color: "", price: "", stock: "", sku: "" }]);
  const removeVariant = (index: number) => setVariants((s) => s.filter((_, i) => i !== index));
  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    setVariants((prev) => {
      const updated = [...prev];
      if (field === "price" || field === "stock") {
        updated[index] = { ...updated[index], [field]: value === "" ? "" : Number(value) } as Variant;
      } else {
        updated[index] = { ...updated[index], [field]: String(value) } as Variant;
      }
      return updated;
    });
  };

  useEffect(() => {
    const fetchProductTypes = async () => {
      try {
        API.apiGet("productTypeList")
          .then((response) => {
            if (response.data) {
              setProductTypes(response.data.data);
              setSelectedProductTypeId(response.data?.data?.[0]?.id);
            } else {
              setProductTypes([]);
            }
          })
          .catch((error) => {
            console.error("Error fetching product types:", error);
            setProductTypes([]);
          });
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

    fetchProductTypes();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[93vh] flex flex-col">

        {/* Header */}
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
        </div>
        
        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Product Name <span className="text-red-500">*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Margherita Pizza" className="w-full mt-1 p-2 border rounded dark:bg-gray-800" />
              </div>

              <div>
                <label className="block text-sm font-medium">Product Type</label>
                <select value={selectedProductTypeId} onChange={(e) => setSelectedProductTypeId(Number(e.target.value))} className="w-full mt-1 p-2 border rounded dark:bg-gray-800">
                  {productTypes.map((pt) => (
                    <option key={pt.id} value={pt.id}>{pt.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 p-2 border rounded dark:bg-gray-800">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description for the product" className="w-full mt-1 p-2 border rounded dark:bg-gray-800" />
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Upload Images</label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full mt-1 p-2 border rounded dark:bg-gray-800" />
                {previewUrls.length > 0 && (
                  <div className="flex flex-wrap mt-2 gap-2">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative w-20 h-20">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover rounded border" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Addons */}
          {selectedProductTypeId && selectedProductType?.name?.toLowerCase() === "food" && (
            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Addons</h3>
                    <button type="button" onClick={addAddon} className="text-blue-600 hover:underline">+ Add Addon</button>
                </div>

                {addons.length === 0 && (
                    <div className="text-sm text-gray-500 mb-2">No addons yet. Add extra toppings, sides or sauces.</div>
                )}

                {addons.map((addon, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2 items-center">
                  <div className="col-span-7">
                    <label className="text-xs text-gray-600">Addon name</label>
                    <input
                      placeholder="e.g. Extra Cheese"
                      value={addon.name}
                      onChange={(e) => handleAddonChange(index, "name", e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-gray-600">Price (₹)</label>
                    <input
                      placeholder="e.g. 29"
                      value={addon.price as any}
                      onChange={(e) => handleAddonChange(index, "price", e.target.value)}
                      className="w-full p-2 border rounded"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="col-span-2 flex justify-end mt-6">
                    <button type="button" onClick={() => removeAddon(index)} className="bg-red-500 text-white rounded px-3 py-2"><Trash2 /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Variants */}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Variants</h3>
              <button type="button" onClick={addVariant} className="text-blue-600 hover:underline">+ Add Variant</button>
            </div>

            {variants.length === 0 && <div className="text-sm text-gray-500 mb-2">No variants yet. Add sizes/colors/prices here.</div>}

            {variants.map((variant, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 mb-3 items-end">
                <div className="col-span-3">
                  <label className="text-xs text-gray-600">Size</label>
                  <input placeholder="M / 7 inch" value={variant.size} onChange={(e) => handleVariantChange(index, "size", e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Color</label>
                  <input placeholder="e.g. Red" value={variant.color} onChange={(e) => handleVariantChange(index, "color", e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Price (₹)</label>
                  <input placeholder="e.g. 199" type="text" value={variant.price as any} onChange={(e) => handleVariantChange(index, "price", e.target.value)} className="w-full p-2 border rounded" inputMode="numeric" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-600">Stock</label>
                  <input placeholder="e.g. 10" type="text" value={variant.stock as any} onChange={(e) => handleVariantChange(index, "stock", e.target.value)} className="w-full p-2 border rounded" inputMode="numeric" />
                </div>

                <div className="col-span-2">
                  <label className="text-xs text-gray-600">SKU</label>
                  <input placeholder="e.g. SKU123" value={variant.sku} onChange={(e) => handleVariantChange(index, "sku", e.target.value)} className="w-full p-2 border rounded" />
                </div>

                <div className="col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeVariant(index)} className="bg-red-500 text-white rounded px-3 py-2"><Trash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="px-6 py-4 border-t dark:border-gray-700 flex justify-end gap-2">
          <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded text-gray-800">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">Save Product</button>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;
