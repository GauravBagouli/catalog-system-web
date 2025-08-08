// src/components/product/AddProductForm.tsx
import { useEffect, useState } from "react";
import API from "../../helpers/api";
import type { ProductType } from "../../stores/types/product";
import { encodeData } from "../../helpers/auth";

interface Props {
  onClose: () => void;
}

const AddProductForm = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Active");
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [selectedProductTypeId, setSelectedProductTypeId] = useState<number>();
  const [base64Images, setBase64Images] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = {
      name,
      description,
      status,
      product_type_id: selectedProductTypeId,
      product_images: base64Images,
    };

    const payload = encodeData(formData);
    
    API.apiPost('addProduct', { payload: payload }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        console.log('Product added successfully');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error adding product:', error);
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

        // When all files are read, update state
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


  useEffect(() => {
    const fetchProductTypes = async () => {
        try {
            API.apiGet('productTypeList')
                .then(response => {
                    if(response.data) {
                        setProductTypes(response.data.data);
                        setSelectedProductTypeId(response.data?.data?.[0]?.id);
                    } else {
                        setProductTypes([]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching product types:', error);
                    setProductTypes([]);
                });
        } catch (error) {
            console.error('Error fetching product types:', error);
        }
    }

    fetchProductTypes();
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Add New Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Type</label>
            <select
              className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={selectedProductTypeId}
              onChange={(e) => setSelectedProductTypeId(parseInt(e.target.value))}
            >
              {productTypes.map((productType) => (
                <option key={productType.id} value={productType.id}>
                  {productType.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full mt-1 p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
            {previewUrls.length > 0 && (
                <div className="flex flex-wrap mt-2 gap-2">
                    {previewUrls.map((url, index) => (
                    <div key={index} className="relative w-20 h-20">
                        <img
                        src={url}
                        alt={`Preview ${index}`}
                        className="w-full h-full object-cover rounded border"
                        />
                        <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-[-8px] right-[-8px] bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                        >
                        ✕
                        </button>
                    </div>
                    ))}
                </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded shadow hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;