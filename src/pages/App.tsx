// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Home from "./home";
import ProductTypeList from "./catalog/index";
import ProductDetails from "./productDetails";


function App() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-types" element={<ProductTypeList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;
