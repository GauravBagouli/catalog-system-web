import { useEffect, useState } from "react";
import type { Product, ProductType } from "../../stores/types/product";
import AddProductForm from "../catalog/AddProduct";
import { getProductList } from "../../stores/actions/product";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../stores/reducers";
import API from "../../helpers/api";

interface Props {}

const Catalog = ({}: Props) => {
  const dispatch = useDispatch();
  const { productList, productListLoading }: { productList: Product[], productListLoading: boolean } = useSelector(
    (state: RootState) => state.product
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const toggleForm = () => setShowAddForm(!showAddForm);

  const handleTypeClick = (typeId: number | null) => {
    setSelectedTypeId(typeId);

    if(typeId) {
      const filteredProducts = productList.filter((product) => parseInt(product.product_type_id) === typeId);
      setProducts(filteredProducts);
    } else {
      dispatch(getProductList() as any);
    }
  };

  useEffect(() => {
    if (productList?.length > 0) {
      setProducts(productList);
    }
  }, [productList]);

  useEffect(() => {
    dispatch(getProductList() as any);

    const fetchProductTypes = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching product types:", error);
      }
    };

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
              className="border rounded-xl shadow hover:shadow-lg transition-all bg-white dark:bg-gray-800 p-4"
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
              <span
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
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Catalog;
