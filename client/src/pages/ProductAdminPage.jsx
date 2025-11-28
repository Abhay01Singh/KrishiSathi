import React, { useState, useEffect } from "react";
import axios from "axios";

const CATEGORIES = ["Seeds", "Tools", "Fertilizers", "Livestock"];

export default function ProductAdminDashboard() {
  const emptyForm = {
    name: "",
    category: "",
    price: "",
    unit: "",
    description: "",
    image: null,
    rating: "",
  };
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch products from backend
  function fetchProducts() {
    axios.get("/api/product/").then((res) => {
      if (res.data.success) setProducts(res.data.product);
    });
  }
  useEffect(fetchProducts, []);

  // Handle form field changes
  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === "image") setForm((f) => ({ ...f, image: files[0] }));
    else setForm((f) => ({ ...f, [name]: value }));
  }

  // Add or update product
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      for (const key in form) if (form[key]) data.append(key, form[key]);
      let res;
      if (editId === null) {
        res = await axios.post("/api/product/addProduct", data, {
          withCredentials: true,
        });
      } else {
        res = await axios.put(`/api/product/update/${editId}`, data, {
          withCredentials: true,
        });
      }
      if (res.data.success) {
        fetchProducts();
        setForm(emptyForm);
        setEditId(null);
      } else {
        setError(res.data.message || "Operation failed");
      }
    } catch {
      setError("Server error.");
    }
    setLoading(false);
  }

  // Edit button populates form
  function handleEdit(product) {
    setEditId(product._id);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      unit: product.unit,
      description: product.description,
      image: product.image || null,
      rating: product.rating,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Delete product
  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/product/delete/${id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        fetchProducts();
        if (editId === id) setEditId(null);
      } else setError(res.data.message || "Delete failed");
    } catch {
      setError("Error deleting product.");
    }
    setLoading(false);
  }

  function handleCancelEdit() {
    setForm(emptyForm);
    setEditId(null);
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      {/* Add/Edit Form */}
      <div className="bg-white p-8 rounded-xl shadow border mb-10">
        <h2 className="text-2xl font-black mb-4 text-[#3E2723]">
          {editId ? "Edit Product" : "Add Product"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="form-input rounded-lg border p-3"
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="form-select rounded-lg border p-3"
            required>
            <option value="">Select Category</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="form-input rounded-lg border p-3 w-1/2"
              required
            />
            <input
              name="unit"
              value={form.unit}
              onChange={handleChange}
              placeholder="Unit (e.g., 500g, bag, head)"
              className="form-input rounded-lg border p-3 w-1/2"
              required
            />
          </div>
          <input
            name="rating"
            type="number"
            max={5}
            min={0}
            step="0.1"
            value={form.rating}
            onChange={handleChange}
            placeholder="Rating (0-5)"
            className="form-input border rounded-lg p-3"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="form-textarea rounded-lg border p-3"
            required
            rows={4}
          />
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChange}
          />
          {form.image && typeof form.image === "string" && (
            <img
              src={form.image}
              className="max-h-32 object-contain mt-2 rounded"
              alt=""
            />
          )}
          {form.image && form.image instanceof File && (
            <img
              src={URL.createObjectURL(form.image)}
              className="max-h-32 object-contain mt-2 rounded"
              alt="preview"
            />
          )}
          {error && <span className="text-red-600">{error}</span>}
          <div className="flex gap-4 items-center mt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#4CAF50] text-white font-bold px-6 py-3 rounded-lg disabled:opacity-50">
              {loading
                ? editId
                  ? "Saving..."
                  : "Adding..."
                : editId
                ? "Save Changes"
                : "Add Product"}
            </button>
            {editId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Product List Table */}
      <div className="bg-white p-6 rounded-xl border shadow">
        <h3 className="font-bold text-lg mb-3">All Products</h3>
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Unit</th>
              <th>Rating</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b last:border-none">
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>₹{p.price}</td>
                <td>{p.unit}</td>
                <td>{p.rating}</td>
                <td className="space-x-2 py-2">
                  <button
                    className="text-[#4CAF50] font-bold px-3 py-1 border rounded hover:bg-[#C8E6C9]"
                    onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button
                    className="text-red-500 font-bold px-3 py-1 border rounded hover:bg-red-100"
                    onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
