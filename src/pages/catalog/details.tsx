import CatalogDetails from "../../components/catalogDetails/index";
import { useLocation } from "react-router-dom";
import { decodeData, encodeData } from "../../helpers/auth";
import { useEffect, useState } from "react";
import API from "../../helpers/api";
import { ChevronLeft } from 'lucide-react';

const CatalogPage = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("id");
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        if(id) {
            let payloadData = {
                id: decodeData(id)
            }
            API.apiGet('productDetails', { payload: encodeData(payloadData) })
            .then((response) => {
                if(response.data) {
                    setProductData(response.data.data);
                } else {
                    setProductData(null);
                }
            })
            .catch((error) => {
                console.error('Error fetching product details:', error);
            });
        }
    }, [id])

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        <div className="flex items-center gap-2">
            <ChevronLeft onClick={() => window.history.back()} className="cursor-pointer" /> Product Details
        </div>
      </h1>
      <CatalogDetails productData={productData} />
    </div>
  );
};

export default CatalogPage;
