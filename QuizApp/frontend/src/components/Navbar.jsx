import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom";
import { navbarStyles } from '../assets/dummyStyles';
import { Award, LogIn, LogOut, Menu, X } from 'lucide-react';
import logo from "../assets/rs-logo.jpeg";

const Navbar = ({logoSrc}) => {

    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
 
    
    //  useEffect hook to show the login state change

      useEffect(() => {
    try {
      const u = localStorage.getItem("authToken");
      setLoggedIn(!!u);
    } catch (e) {
      setLoggedIn(false);
    }

    const handler = (ev) => {
      const detailUser = ev?.detail?.user ?? null;
      setLoggedIn(!!detailUser);
    };
    window.addEventListener("authChanged", handler);

    return () => window.removeEventListener("authChanged", handler);
  }, []);

    //  LOGOUT FUNCTION

    const handleLogout = () => {
        try {
            localStorage.removeItem("authToken");
            //localStorage.clear();
        } catch (e) {
            // Ignore all the error
        }
        window.dispatchEvent(
            new CustomEvent("authChanged", { detail: { user: null }})
        );
        setMenuOpen(false);
        try {
            navigate("/login");
        } catch (e) {
            window.location.href = "/login";
        }
    };
  return (
    <div>
      <nav className={navbarStyles.nav}>
        <div
            
            className={navbarStyles.decorativePattern}>

        </div>

        <div className={navbarStyles.bubble1}></div>
        <div className={navbarStyles.bubble2}></div>
        <div className={navbarStyles.bubble3}></div>

        <div className={navbarStyles.container}>
            <div className={navbarStyles.logoContainer}>
            <Link to="/" className={navbarStyles.logoButton}>
            <div className={navbarStyles.logoInner}>
              <img
                src={
                  logoSrc ||
                  "https://cdn.corenexis.com/f/t4z2eBvfgxe.jpeg"
                }
                alt="QuizMaster logo"
                className={navbarStyles.logoImage}
              />
            </div>
          </Link>
            </div>

            <div className={navbarStyles.titleContainer}>
                <div className={navbarStyles.titleBackground}>
                    <h1 className={navbarStyles.titleText}>Self_Developer Quiz Application</h1>
                </div>
            </div>

            <div className={navbarStyles.desktopButtonsContainer}>
                <div className={navbarStyles.spacer}>
                    <NavLink to='/result' className={navbarStyles.resultsButton}>
                        <Award className={navbarStyles.buttonIcon} />
                        My Result
                    </NavLink>

                    {loggedIn ? (
                        <button onClick={handleLogout}
                        className={navbarStyles.logoutButton}>
                            <LogOut className={navbarStyles.buttonIcon} />
                            Logout
                        </button>
                    ) : (
                        <NavLink to="/login" className={navbarStyles.loginButton}>
                            <LogIn className={navbarStyles.buttonIcon} />
                            Login
                        </NavLink>
                    )}
                </div>

                <div className={navbarStyles.mobileMenuContainer}>
                    <button 
                        onClick={() => setMenuOpen((s) => !s)}
                        className={navbarStyles.menuToggleButton}
                    >
                        {menuOpen ? (
                            <X className={navbarStyles.menuIcon} />
                        ) : (
                            <Menu className={navbarStyles.menuIcon} />
                        )}
                    </button>

                    {menuOpen && (
                        <div className={navbarStyles.mobileMenuItem}>
                            <ul className={navbarStyles.mobileMenuList}>
                                <li>
                                    <NavLink 
                                        to="/result"
                                        className={navbarStyles.mobileMenuItem}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Award className={navbarStyles.mobileMenuIcon} />
                                        My result
                                    </NavLink>
                                </li>

                                {loggedIn ? (
                                    <li>
                                        <button type="button" onClick={handleLogout} className={navbarStyles.mobileMenuItem}>
                                            <LogOut className={navbarStyles.buttonIcon}/>
                                            Logout
                                        </button>
                                    </li>
                                ) : (
                                    <li>
                                        {/* <NavLink 
                                            to="/login"
                                            className={navbarStyles.mobileMenuItem}
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            <LogIn className={navbarStyles.mobileMenuIcon} />
                                            Login
                                        </NavLink> */}
                                        <NavLink
  to="/login"
  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
>
  <LogIn className="w-5 h-5" />
  Login
</NavLink>
                                    </li>
                                )}
                            </ul>

                        </div>
                    )}

                </div>
            </div>

        </div>
        <style>{navbarStyles.animations}</style>
      </nav>
    </div>
  );
};

export default Navbar;
