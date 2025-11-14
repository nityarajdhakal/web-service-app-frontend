import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import HamburgerMenu from "../components/HamburgerMenu";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";


const API_BASE_URL = "http://localhost:5000/api";

const LoginPage = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("EN");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("test@example.com"); 
  const [password, setPassword] = useState("password123"); 
  const [texts, setTexts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        
        const langCode = language === "SE" ? "sv" : "en";
        const res = await fetch(`${API_BASE_URL}/translations?page=login&lang=${langCode}`);
        const data = await res.json();
        if (data.success) {
          setTexts(data.data);
        } else {
          console.error("Failed to fetch translations:", data.message);
        }
      } catch (err) {
        console.error("Error fetching translations:", err);
      }
    };
    fetchTranslations();
  }, [language]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.accessToken);
        navigate("/pricelist"); 
      } else {
        setError(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-page-container">
      <HamburgerMenu texts={texts} page="login" />
      
      <div className="language-toggle">
        <img
          src="https://storage.123fakturere.no/public/flags/GB.png"
          alt="English"
          onClick={() => setLanguage("EN")}
          className={language === "EN" ? "active-flag" : ""}
        />
        <img
          src="https://storage.123fakturere.no/public/flags/SE.png"
          alt="Swedish"
          onClick={() => setLanguage("SE")}
          className={language === "SE" ? "active-flag" : ""}
        />
      </div>

      <div className="login-box">
        <h2>{texts.loginTitle || 'Login'}</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              placeholder={texts.emailPlaceholder || 'Email'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={texts.passwordPlaceholder || 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
  {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
</span>
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">{texts.loginButton || 'Login'}</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;













