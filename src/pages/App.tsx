// src/App.tsx
import { Routes, Route } from "react-router-dom";
import ProductTypeList from "./catalog/index";
import ProductDetails from "./catalog/details";

function App() {
  return (
    <div className="p-4">
      <Routes>
        <Route path="/" element={<ProductTypeList />} />
        <Route path="/details" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}

export default App;
