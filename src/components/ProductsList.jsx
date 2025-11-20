import React from "react";
import useFetch from "../hooks/useFetch";
import "./ProductsList.css";

export default function ProductsList() {
  const api = "https://api.escuelajs.co/api/v1/products";
  const { data: products, loading, error, refetch } = useFetch(api);

  return (
    <div className="products-container">
      <h2>Products</h2>
      <div className="controls">
        <button onClick={() => refetch()} className="btn">
          Refetch
        </button>
        <button
          onClick={() =>
            refetch("https://api.escuelajs.co/api/v1/products?limit=6")
          }
          className="btn"
        >
          Fetch 6 items
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner" />
          <span>Loading...</span>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Error:</strong>
          {error.message}
          <div>
            <button onClick={() => refetch()} className="btn">
              Try again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && Array.isArray(products) && (
        <ul className="product-list">
          {products.map((p) => (
            <li key={p.id} className="product-card">
              <img src={p.images?.[0]} alt={p.title} className="product-img" />
              <div className="product-info">
                <h3>{p.title}</h3>
                <p className="price">₹{p.price}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && !products && (
        <div className="empty">No data to show</div>
      )}
    </div>
  );
}
