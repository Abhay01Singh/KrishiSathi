import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext.jsx";

const CATEGORIES = [
  "All Products",
  "Seeds",
  "Fertilizers",
  "Tools",
  "Livestock",
];

export default function MarketplacePage() {
  const { axios } = useAppContext();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All Products");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [backendError, setBackendError] = useState("");

  async function fetchProducts() {
    setLoading(true);
    setBackendError("");
    try {
      const { data } = await axios.get("/api/product/", {
        params: { category, search },
      });
      if (data.success && data.product) setProducts(data.product);
      else setBackendError(data.message || "Could not load products.");
    } catch (error) {
      setBackendError("Could not fetch products.");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, [category, search]);

  return (
    <div className="font-display bg-[#F5F5DC] min-h-screen text-[#111812]">
      <header className="sticky top-0 z-10 w-full bg-white/80 backdrop-blur-sm border-b border-black/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#4CAF50] text-3xl">
              agriculture
            </span>
            <h2 className="text-xl font-bold tracking-tight">Krishisathi</h2>
          </div>
          <div className="flex w-full items-stretch rounded-lg h-full">
            <div className="flex items-center justify-center pl-3 rounded-l-lg bg-[#F5F5F5] text-gray-500 border-r-0">
              <span className="material-symbols-outlined">search</span>
            </div>
            <input
              className="form-input w-full min-w-0 flex-1 rounded-lg text-[#212121] bg-[#F5F5F5] h-full px-4 border-none placeholder:text-gray-500"
              placeholder="Search Products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Link
            to="/admin/products"
            className="rounded bg-[#4CAF50] text-white px-5 py-2 font-bold">
            Admin Panel
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8 min-h-[60vh]">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24">
              <div className="flex flex-col gap-6 bg-white p-6 rounded-xl border border-black/10">
                <div>
                  <h3 className="text-lg font-bold">Filters</h3>
                  <p className="text-sm text-[#388E3C]">Refine your search</p>
                </div>
                <div className="flex flex-col pl-4 gap-1 text-sm mt-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={`text-left block py-1 px-2 rounded-md font-semibold ${
                        cat === category
                          ? "bg-[#C8E6C9] text-[#4CAF50]"
                          : "hover:bg-black/5"
                      }`}
                      onClick={() => setCategory(cat)}>
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  className="mt-4 bg-[#4CAF50] text-white py-2 px-4 rounded hover:bg-green-700"
                  onClick={fetchProducts}>
                  Refresh Products
                </button>
              </div>
            </div>
          </aside>
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tighter">
              Agricultural Marketplace
            </h1>
            <p className="text-base text-[#388E3C] mb-6">
              Buy and sell agricultural products, seeds, and tools
            </p>
            {backendError && (
              <div className="text-red-600 bg-red-100 border border-red-200 p-3 rounded mb-4">
                {backendError}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-3 text-center text-2xl">
                  Loading...
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-3 text-center text-gray-400 text-lg">
                  No products found.
                </div>
              ) : (
                products.map((p) => (
                  <Link
                    to={`/product/${p._id}`}
                    key={p._id}
                    className="flex flex-col gap-4 bg-white rounded-xl overflow-hidden border border-black/10 group transition-all hover:shadow-xl hover:-translate-y-1">
                    <div
                      className="w-full bg-center bg-no-repeat aspect-video bg-cover"
                      style={{ backgroundImage: `url('${p.image}')` }}
                    />
                    <div className="p-4 pt-0 flex flex-col flex-grow gap-3">
                      <h4 className="text-base font-bold leading-normal">
                        {p.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#4CAF50]">
                          ₹{p.price} / {p.unit}
                        </p>
                        <div className="flex items-center gap-1 text-[#FFC107]">
                          <span
                            className="material-symbols-outlined"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                          </span>
                          <span className="text-xs font-medium text-[#388E3C]">
                            {p.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#388E3C]">
                        Seller: {p.seller?.name || "N/A"}
                      </p>
                      <span className="mt-auto w-full flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#FFC107] text-black text-sm font-bold">
                        View Details
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
