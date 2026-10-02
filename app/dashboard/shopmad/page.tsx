"use client";

import { useEffect, useState } from "react";

export default function ShopMADPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = typeof window !== "undefined"
    ? localStorage.getItem("madai_token")
    : null;

  async function loadProducts() {
    try {
      const res = await fetch("https://YOUR_BACKEND_URL/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function addProduct(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://YOUR_BACKEND_URL/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, price, description, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to add product");
        setLoading(false);
        return;
      }

      setName("");
      setPrice("");
      setDescription("");
      setImage("");

      loadProducts();
    } catch (err) {
      console.error(err);
      setError("Server error");
    }

    setLoading(false);
  }

  async function deleteProduct(id) {
    try {
      await fetch(`https://YOUR_BACKEND_URL/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      loadProducts();
    } catch (err) {
      console.error(err);
      setError("Failed to delete product");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-6">ShopMAD Product Manager</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-600/40 border border-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={addProduct} className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Add Product</h2>

        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-3 bg-neutral-900 border border-neutral-700 rounded"
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 mb-3 bg-neutral-900 border border-neutral-700 rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 mb-3 bg-neutral-900 border border-neutral-700 rounded"
          rows={3}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-3 mb-3 bg-neutral-900 border border-neutral-700 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full p-3 bg-teal-500 hover:bg-teal-600 rounded font-semibold"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>

      <h2 className="text-2xl font-semibold mb-4">Products</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="p-4 bg-neutral-900 border border-neutral-700 rounded-lg"
          >
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="text-teal-400">${p.price}</p>
            <p className="mt-2">{p.description}</p>

            {p.image && (
              <img
                src={p.image}
                alt={p.name}
                className="mt-3 rounded border border-neutral-700"
              />
            )}

            <button
              onClick={() => deleteProduct(p.id)}
              className="mt-4 w-full p-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
