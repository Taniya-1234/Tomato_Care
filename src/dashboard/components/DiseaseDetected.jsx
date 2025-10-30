import React, { useState, useEffect } from "react";
// import { db } from './firebase-config'; // Uncomment when Firebase is configured
// import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

const DiseaseDetected = () => {
  const [detectionResult, setDetectionResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestScan();
  }, []);

  const fetchLatestScan = async () => {
    try {
      // Uncomment this section when database is connected
      /*
      const userEmail = "abc@gmail.com"; // Get from auth context/localStorage
      const scansRef = collection(db, "scans");
      const q = query(
        scansRef,
        where("userEmail", "==", userEmail),
        where("status", "==", "analyzed"),
        orderBy("scanDate", "desc"),
        limit(1)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const latestScan = querySnapshot.docs[0].data();
        
        setDetectionResult({
          disease: latestScan.diseaseName,
          confidence: latestScan.confidence,
          treatment: latestScan.treatment,
          severity: latestScan.severity,
          imageUrl: latestScan.imageBase64 // Base64 string from database
        });
      }
      */

      setLoading(false);
    } catch (error) {
      console.error("Error fetching scan data:", error);
      setLoading(false);
    }
  };

  // Convert base64 to displayable image
  const getImageSrc = () => {
    if (detectionResult?.imageUrl) {
      // If it's already a URL
      if (detectionResult.imageUrl.startsWith("http")) {
        return detectionResult.imageUrl;
      }
      // If it's base64 from database (already includes data:image/png;base64,)
      return detectionResult.imageUrl;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="card" style={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}>
        <div className="card-body text-center py-5">
          <div className="spinner-border text-success" role="status" style={{ width: "40px", height: "40px" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted mb-0">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!detectionResult) {
    return (
      <div className="card" style={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}>
        <div className="card-body text-center py-5">
          <div style={{ fontSize: "64px", color: "#ccc", marginBottom: "15px" }}>
            ➕
          </div>
          <h6 className="fw-bold mb-2">No Analysis Yet</h6>
          <p className="text-muted small mb-0" style={{ fontSize: "13px" }}>
            Upload a leaf image to detect diseases and get treatment
            recommendations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ borderRadius: "12px", border: "1px solid #e0e0e0" }}>
      <div className="card-body" style={{ padding: "24px" }}>
        <h6 className="fw-bold mb-3" style={{ fontSize: "16px" }}>Disease Detected</h6>

        <div className="d-flex justify-content-between align-items-start">
          <div className="flex-grow-1 me-3">
            <h5 className="mb-3" style={{ color: "#4caf50", fontWeight: "600" }}>
              {detectionResult.disease}
            </h5>

            <div className="mb-3">
              <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>Confidence level</p>
              <h6 className="mb-0" style={{ fontWeight: "600" }}>{detectionResult.confidence}%</h6>
            </div>

            {detectionResult.severity && (
              <div className="mb-3">
                <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>Severity</p>
                <span
                  className={`badge ${
                    detectionResult.severity === "High"
                      ? "bg-danger"
                      : detectionResult.severity === "Moderate"
                      ? "bg-warning text-dark"
                      : "bg-success"
                  }`}
                  style={{ fontSize: "12px", padding: "5px 12px" }}
                >
                  {detectionResult.severity}
                </span>
              </div>
            )}

            <div>
              <p className="mb-1 text-muted" style={{ fontSize: "13px" }}>Preventive</p>
              <p className="mb-0" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                {detectionResult.treatment}
              </p>
            </div>
          </div>

          {getImageSrc() && (
            <div>
              <img
                src={getImageSrc()}
                alt="Detected disease"
                className="rounded"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  border: "2px solid #f0f0f0",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetected;