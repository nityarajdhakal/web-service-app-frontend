import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./HamburgerMenu.css";

const HamburgerMenu = ({ texts, page }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    
    const handleLogoutAndGoHome = (e) => {
        e.preventDefault(); 
        
        localStorage.removeItem("token"); 
        navigate('/login'); 
        setMenuOpen(false); 
    };

    return (
        <div className="top-left-container">
            <img
                src="https://storage.123fakturera.se/public/icons/diamond.png"
                alt="diamond logo"
                className="diamond-logo"
            />
            <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                &#9776;
            </div>
            <div className={`menu ${menuOpen ? "open" : ""}`}>
                
                <a href="#" onClick={handleLogoutAndGoHome}>{texts.menuHome || 'Home'}</a>

                
                <Link to="#" onClick={() => setMenuOpen(false)}>{texts.menuContact || 'Contact'}</Link>
                
               
                <Link to="/terms" onClick={() => setMenuOpen(false)}>Terms</Link>
                
                
                {page !== 'login' && <a href="#" onClick={handleLogoutAndGoHome}>Logout</a>}
            </div>
        </div>
    );
};

export default HamburgerMenu;

