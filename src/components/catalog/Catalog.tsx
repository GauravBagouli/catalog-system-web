import { useEffect, useState } from "react";
import type { Product, ProductType } from "../../stores/types/product";
import AddProductForm from "../catalog/AddProduct";
import { getProductList } from "../../stores/actions/product";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../stores/reducers";
import API from "../../helpers/api";
import { useNavigate } from "react-router-dom";
import { encodeData } from "../../helpers/auth";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

interface Props {}

const Catalog = ({}: Props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    productList,
    productListLoading,
  }: { productList: Product[]; productListLoading: boolean } = useSelector(
    (state: RootState) => state.product
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showTypeModal, setShowTypeModal] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");

  const toggleForm = () => setShowAddForm(!showAddForm);

  const handleTypeClick = (typeId: number | null) => {
    setSelectedTypeId(typeId);

    if (typeId) {
      const filteredProducts = productList.filter(
        (product) => parseInt(product.product_type_id) === typeId
      );
      setProducts(filteredProducts);
    } else {
      dispatch(getProductList() as any);
    }
  };

  const handleProductClick = (productId: number) => {
    let encodedId = encodeData(productId);
    navigate(`/details?id=${encodedId}`);
  };

  const fetchProductTypes = () => {
    API.apiGet("productTypeList")
      .then((response) => {
        if (response.data) {
          setProductTypes(response.data.data);
        } else {
          setProductTypes([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching product types:", error);
        setProductTypes([]);
      });
  };

  const handleAddType = async () => {
    if (!newTypeName.trim()) return;

    try {
      let payload = {
        name: newTypeName,
      };
      await API.apiPost(
        "addProductType",
        { payload: encodeData(payload) },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((response) => {
          setNewTypeName("");
          setShowTypeModal(false);
          fetchProductTypes();
          if (response.data) {
            toast.success("Product type added successfully");
          }
        })
        .catch((error) => {
          setNewTypeName("");
          setShowTypeModal(false);
          fetchProductTypes();
          toast.error("Failed to add product type");
          console.error("Error adding product type:", error);
        });
    } catch (error) {
      console.error("Error adding product type:", error);
    }
  };

  useEffect(() => {
    if (productList?.length > 0) {
      setProducts(productList);
    }
  }, [productList]);

  useEffect(() => {
    dispatch(getProductList() as any);
    fetchProductTypes();
  }, []);

  if (productListLoading) return <div className="p-4">Loading...</div>;

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {/* Capsules */}
          <button
            onClick={() => handleTypeClick(null)}
            className={`px-3 py-1 rounded-full border ${
              selectedTypeId === null
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700"
            }`}
          >
            All
          </button>
          {productTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeClick(parseInt(type.id))}
              className={`px-3 py-1 rounded-full border ${
                selectedTypeId === parseInt(type.id)
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {type.name}
            </button>
          ))}

          <button
            onClick={() => setShowTypeModal(true)}
            className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200"
            title="Add Product Type"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        <button
          onClick={toggleForm}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {showAddForm && (
        <div className="mb-8">
          <AddProductForm onClose={toggleForm} />
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center text-gray-500">No products found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="border rounded-xl shadow hover:shadow-lg transition-all bg-white dark:bg-gray-800 p-4 cursor-pointer"
              onClick={() => handleProductClick(parseInt(product.id))}
            >
              {product.product_images?.[0] ? (
                <img
                  src={product.product_images[0]}
                  alt={product.name}
                  className="h-40 w-full object-cover rounded mb-4"
                />
              ) : (
                <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {product.description}
              </p>
              {/* <span
                className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded ${
                  product.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {product.status}
              </span>
              <div className="text-xs text-gray-400 mt-2">
                Created at: {new Date(product.created_at).toLocaleDateString()}
              </div> */}
            </div>
          ))}
        </div>
      )}

      {showTypeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50 backdrop-blur">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Add Product Type</h2>
            <input
              type="text"
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Type Name"
              className="border p-2 w-full rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowTypeModal(false); setNewTypeName(""); }}
                className="px-4 py-2 bg-gray-600 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddType}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Catalog;
