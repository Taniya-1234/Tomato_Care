import React, { useState, useContext } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig"; 
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: formData.name,
        email: formData.email,
        createdAt: new Date(),
        imageUrl: "",
      });

      login(user, "firebaseToken");
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "90vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dcedc8 0%, #a5d6a7 100%)",
        padding: "40px",
        boxSizing: "border-box",
        marginLeft:"300px"
      }}
    >
      <div
        className="card shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "20px",
          backgroundColor: "white",
          padding: "40px",
          margin:"100px"
        }}
      >
        <div className="text-center mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/295/295128.png"
            alt="Signup Icon"
            width="80"
            height="80"
            className="mb-3"
          />
          <h3 className="fw-bold text-success mb-2">Create Your Account</h3>
          <p className="text-muted mb-0">
            Join TomatoCare today and start your journey!
          </p>
        </div>

        {error && (
          <div className="mb-3">
            <ErrorMessage message={error} onClose={() => setError("")} />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Your Name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{ fontSize: "16px", padding: "20px 12px" }}
            />
            <label htmlFor="name">Full Name</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              style={{ fontSize: "16px", padding: "20px 12px" }}
            />
            <label htmlFor="email">Email address</label>
          </div>

          <div className="form-floating mb-4">
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              style={{ fontSize: "16px", padding: "20px 12px" }}
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-success btn-lg"
              disabled={loading}
              style={{ 
                padding: "15px",
                fontSize: "18px",
                fontWeight: "600"
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Creating Account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-muted">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-success fw-semibold text-decoration-none"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;