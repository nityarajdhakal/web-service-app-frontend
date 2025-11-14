import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TermsPage.css";
import HamburgerMenu from "../components/HamburgerMenu";

const API_BASE_URL = "http://localhost:5000/api";

const TermsPage = () => {
    const navigate = useNavigate();
    const [language, setLanguage] = useState("EN");
    const [texts, setTexts] = useState({});

    useEffect(() => {
        const fetchTranslations = async () => {
            try {
                const langCode = language === "SE" ? "sv" : "en";
                const res = await fetch(`${API_BASE_URL}/translations?page=terms&lang=${langCode}`);
                const data = await res.json();
                if (data.success) {
                    setTexts(data.data);
                }
            } catch (err) {
                console.error("Error fetching translations:", err);
            }
        };
        fetchTranslations();
    }, [language]);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="terms-page-container new-terms-style">
            <header className="terms-header">
                
                <HamburgerMenu texts={texts} page="terms" />
                

                <nav className="terms-nav">
                    <a href="#">Home</a>
                    <a href="#">Order</a>
                    <a href="#">Our Customers</a>
                    <a href="#">About Us</a>
                    <a href="#">Contact Us</a>
                </nav>
                <div className="terms-language-toggle" onClick={() => setLanguage(language === 'EN' ? 'SE' : 'EN')} style={{cursor: 'pointer'}}>
                    <span>{language === 'EN' ? 'English' : 'Svenska'}</span>
                    <img 
                      src={language === 'EN' ? 'https://storage.123fakturere.no/public/flags/GB.png' : 'https://storage.123fakturere.no/public/flags/SE.png'} 
                      alt="Language Flag"
                    />
                </div>
            </header>

            <main className="terms-main-content">
                <h1>{texts.title || "Terms"}</h1>
                <button onClick={handleGoBack} className="close-button">
                    {texts.closeButton || "Close and Go Back"}
                </button>
                <div className="terms-content-box">
                    <p>{texts.content}</p>
                </div>
            </main>
        </div>
    );
};

export default TermsPage;

