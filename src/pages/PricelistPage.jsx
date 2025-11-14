import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PricelistPage.css";
import HamburgerMenu from "../components/HamburgerMenu";
import { Search, Plus, Printer, SlidersHorizontal, ChevronDown, MoreVertical } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

const PricelistPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("EN");
  const [texts, setTexts] = useState({});
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        
        const langCode = language === "SE" ? "sv" : "en";
        const res = await fetch(`${API_BASE_URL}/translations?page=pricelist&lang=${langCode}`);
        const data = await res.json();
        if (data.success) setTexts(data.data);
      } catch (err) {
        console.error("Error fetching translations:", err);
      }
    };
    fetchTranslations();
  }, [language]);

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("token");
     
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/products`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token"); // 
          navigate("/login"); 
          return;
        }

        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
        } else {
          alert("Failed to fetch products: " + data.message);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, [navigate]);

  const handleInputChange = (id, field, value) => {
    setProducts(currentProducts =>
      currentProducts.map(p => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleUpdateOnBlur = async (id) => {
    const productToUpdate = products.find(p => p.id === id);
    if (!productToUpdate) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
        const res = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(productToUpdate)
        });

        const data = await res.json();
        if (!data.success) {
            alert('Failed to update product: ' + data.message);
        }
    } catch (err) {
        console.error("Error updating product:", err);
        alert('An error occurred while saving.');
    }
  };

  return (
    <div className="pricelist-page-container">
      
      <header className="pricelist-header">
        <div className="header-left">
          <HamburgerMenu texts={texts} page="pricelist" />
          <h1 className="header-title">Pricelist</h1>
        </div>
        <div className="header-right">
          <div className="language-toggle-header">
            <span className="language-text">{language === "EN" ? "English" : "Svenska"}</span>
            <img 
              src={language === "EN" ? "https://storage.123fakturere.no/public/flags/GB.png" : "https://storage.123fakturere.no/public/flags/SE.png"} 
              alt={language} 
              onClick={() => setLanguage(language === "EN" ? "SE" : "EN")}
              className="header-flag"
            />
          </div>
        </div>
      </header>

      
      <div className="pricelist-main-content">
        
        <div className="pricelist-controls">
          <div className="search-bars">
            <div className="search-bar">
              <input type="text" placeholder="Search Article No..." disabled />
              <Search size={20} color="#777" />
            </div>
            <div className="search-bar">
              <input type="text" placeholder="Search Product..." disabled />
              <Search size={20} color="#777" />
            </div>
          </div>
          <div className="action-buttons">
            <button className="action-btn new-product-btn" title="New Product">
              <Plus size={20} />
            </button>
            <button className="action-btn print-btn" title="Print List">
              <Printer size={20} />
            </button>
            <button className="action-btn advanced-btn" title="Advanced mode">
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>

        
        <div className="table-container">
          <div className="table-wrapper">
            <table className="pricelist-table">
              <thead>
                <tr>
                  <th className="article-col">
                    Article No.
                    <ChevronDown size={16} className="sort-icon" />
                  </th>
                  <th className="product-col">
                    Product/Service
                    <ChevronDown size={16} className="sort-icon" />
                  </th>
                  <th className="in-price-col">In Price</th>
                  <th className="price-col">Price</th>
                  <th className="unit-col">Unit</th>
                  <th className="stock-col">In Stock</th>
                  <th className="desc-col">Description</th>
                  <th className="actions-col">...</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="no-products">
                      No products available.
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id}>
                      <td data-label="Article No." className="article-col">
                        <input 
                          type="text" 
                          value={product.article_no || ''} 
                          onChange={(e) => handleInputChange(product.id, 'article_no', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td data-label="Product/Service" className="product-col">
                        <input 
                          type="text" 
                          value={product.product_name || ''} 
                          onChange={(e) => handleInputChange(product.id, 'product_name', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td data-label="In Price" className="in-price-col">
                        <input 
                          type="number" 
                          value={product.in_price || ''} 
                          onChange={(e) => handleInputChange(product.id, 'in_price', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td data-label="Price" className="price-col">
                        <input 
                          type="number" 
                          value={product.price || ''} 
                          onChange={(e) => handleInputChange(product.id, 'price', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td data-label="Unit" className="unit-col">
                        <input 
                          type="text" 
                          value={product.unit || ''} 
                          onChange={(e) => handleInputChange(product.id, 'unit', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td data-label="In Stock" className="stock-col">
                        <input 
                          type="number" 
                          value={product.in_stock || ''} 
                          onChange={(e) => handleInputChange(product.id, 'in_stock', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td data-label="Description" className="desc-col">
                        <input 
                          type="text" 
                          value={product.description || ''} 
                          onChange={(e) => handleInputChange(product.id, 'description', e.target.value)} 
                          onBlur={() => handleUpdateOnBlur(product.id)} 
                        />
                      </td>
                      <td className="actions-col">
                        <MoreVertical size={18} className="actions-icon" />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricelistPage;


