import Catalog from "../../components/catalog/Catalog";

const CatalogPage = () => {

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Product Catalog
      </h1>
      <Catalog />
    </div>
  );
};

export default CatalogPage;
