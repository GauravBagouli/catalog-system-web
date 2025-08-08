import { useParams } from "react-router-dom";

function ProductDetails() {
  const { id } = useParams();

  return <h1 className="text-xl font-bold">Product Details for ID: {id}</h1>;
}

export default ProductDetails;
