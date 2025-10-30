import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadLeafCard = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/upload"); // Redirect to /upload page
  };

  return (
    <div
      className="card shadow-sm"
      style={{ 
        maxWidth: "100%", 
        minHeight: "320px",
        cursor: "pointer",
        border: "2px dashed #ccc",
        borderRadius: "12px",
        transition: "all 0.3s ease"
      }}
      onClick={handleClick}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = "#4caf50"}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = "#ccc"}
    >
      <div className="card-body text-center" style={{ padding: "40px 20px" }}>
        <div 
          className="d-flex flex-column align-items-center justify-content-center mb-3"
          style={{ minHeight: "150px" }}
        >
          {selectedImage ? (
            <img
              src={selectedImage}
              alt="Leaf Preview"
              className="rounded mb-3"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: "60px", color: "#ccc", marginBottom: "15px" }}>
              🍃
            </div>
          )}

          <button 
            className="btn btn-success btn-lg"
            style={{ 
              borderRadius: "8px",
              padding: "12px 30px",
              fontWeight: "600"
            }}
          >
            Upload Leaf Image
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadLeafCard;


/* borderRadius: "12px",
        border: "1px solid #e0e0e0",
        height: "auto",
        minHeight: "320px",
        display: "flex",
        flexDirection: "column" */