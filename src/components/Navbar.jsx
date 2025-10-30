import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);

    // Simulate a short logout loading period
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      navigate("/"); // Redirect to landing page after logout
    }, 2000);
  };

  return (
    <nav className="navbar navbar-expand-lg bg-light fixed-top mb-5">
      <div className="container-fluid d-flex justify-content-between align-items-center m-0 px-4">
        {/* Logo + Brand */}
        <Link 
          className="navbar-brand d-flex align-items-center ps-3" 
          to={user ? "/dashboard" : "/"}
        >
          <img
            src="/logo.png"
            alt="TomatoCare Logo"
            style={{ width: "40px", height: "40px", objectFit: "contain" }}
            className="me-2"
          />
          <span className="fw-bold text-success fs-5">TomatoCare</span>
        </Link>

        {/* Right side */}
        <div className="d-flex align-items-center gap-3">
          {!user ? (
            <>
              <button
                className="btn btn-outline-success me-2"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate("/signup")}
              >
                Signup
              </button>
            </>
          ) : (
            <>
              {isLoggingOut ? (
                <div className="d-flex align-items-center">
                  <div
                    className="spinner-border text-danger me-2"
                    role="status"
                    style={{ width: "1.2rem", height: "1.2rem" }}
                  ></div>
                  <span className="fw-semibold text-danger">Logging off...</span>
                </div>
              ) : (
                <>
                  <i className="fa-solid fa-user text-success"></i>
                  <span className="fw-bold">{user.username || user.name}</span>
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;