import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`/api/product/${id}`)
      .then((res) => {
        if (res.data.success) setProduct(res.data.product);
        else setError(res.data.message || "Not found");
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch.");
        setLoading(false);
      });
  }, [id]);
  if (loading)
    return <div className="py-16 text-center text-lg">Loading...</div>;
  if (error)
    return <div className="py-16 text-center text-red-600">{error}</div>;
  if (!product) return null;
  return (
    <div className="min-h-screen bg-[#F5F5DC] font-display">
      <header className="sticky top-0 z-10 w-full bg-white/80 border-b border-black/10 py-3 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[#4CAF50] text-3xl">
            agriculture
          </span>
          <h2 className="text-xl font-bold tracking-tight">Krishisathi</h2>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded bg-[#4CAF50] text-white px-5 py-2 font-bold">
          Back
        </button>
      </header>
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg border border-black/10 flex flex-col md:flex-row gap-8 p-8">
          <div className="flex-1">
            <div
              className="aspect-video bg-center bg-cover rounded-lg mb-6"
              style={{ backgroundImage: `url('${product.image}')` }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <h1 className="text-2xl font-black text-[#3E2723] mb-2">
              {product.name}
            </h1>
            <div className="flex gap-2 items-center text-sm">
              <span className="rounded bg-[#C8E6C9] text-[#4CAF50] px-3 py-1 font-medium">
                {product.category}
              </span>
              <span className="ml-auto flex items-center gap-1 text-[#FFC107]">
                <span className="material-symbols-outlined">star</span>
                <span className="text-[#388E3C] text-base">
                  {product.rating}
                </span>
              </span>
            </div>
            <div className="text-xl font-bold text-[#4CAF50]">
              ₹{product.price}{" "}
              <span className="text-base text-gray-400">/ {product.unit}</span>
            </div>
            <div className="text-base text-[#575430] pb-1">
              {product.description}
            </div>
            <div className="py-2 text-[#388E3C] text-sm">
              Seller:{" "}
              <span className="font-bold">{product.seller?.name || "N/A"}</span>
            </div>
            <button className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-[#FFC107] text-black text-lg font-bold hover:bg-yellow-500 transition-colors mt-2">
              <span className="material-symbols-outlined">
                add_shopping_cart
              </span>
              Add to Cart
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
