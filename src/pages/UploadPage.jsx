import React, { useState, useRef, useContext } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

const SimpleUploadPage = () => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
  const { user } = useContext(AuthContext);

  // Backend API URL
  const API_URL = "http://localhost:5000/api";

  // 🖼️ Convert file to Base64 string
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      setError("Image size should be less than 10MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
    setPrediction(null);
    setError("");
    setUploadSuccess(false);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    if (!user) {
      setError("You must be logged in to analyze images");
      return;
    }

    setLoading(true);
    setUploadSuccess(false);
    setError("");

    try {
      // 🔹 1. Convert the image to Base64 FIRST (for Firestore backup)
      console.log("Converting image to Base64...");
      const base64Image = await convertToBase64(selectedFile);
      console.log("Base64 conversion successful");

      // 🔹 2. Save to Firestore IMMEDIATELY (before prediction)
      console.log("Saving to Firestore...");
      const scanData = {
        userId: user.uid,
        userEmail: user.email,
        imageBase64: base64Image,
        imageName: selectedFile.name,
        imageSize: selectedFile.size,
        diseaseName: "Pending Analysis",
        confidence: 0,
        severity: "Unknown",
        treatment: "Analysis in progress...",
        scanDate: serverTimestamp(),
        status: "pending",
      };

      const docRef = await addDoc(collection(db, "scans"), scanData);
      console.log("✅ Scan saved to Firestore with ID:", docRef.id);
      
      setUploadSuccess(true);
      setError("✅ Image saved successfully! Analysis will be available when backend is connected.");

      // 🔹 3. TRY to call Flask API (but don't fail if backend is down)
      try {
        console.log("Attempting to connect to backend...");
        const formData = new FormData();
        formData.append("image", selectedFile);

        const response = await fetch(`${API_URL}/predict`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`);
        }

        const result = await response.json();

        if (result.status === "success") {
          const predictionData = result.prediction;

          const predictionResult = {
            disease: predictionData.disease,
            confidence: predictionData.confidence,
            severity: predictionData.disease_info.severity,
            description: predictionData.disease_info.description,
            treatment: predictionData.disease_info.treatment,
            allPredictions: result.all_predictions.slice(0, 5),
            timestamp: result.timestamp,
          };

          setPrediction(predictionResult);

          // Update Firestore with prediction results
          await addDoc(collection(db, "scans"), {
            ...scanData,
            diseaseName: predictionResult.disease,
            confidence: predictionResult.confidence,
            severity: predictionResult.severity,
            treatment: predictionResult.treatment,
            status: "analyzed",
          });

          console.log("✅ Prediction successful and updated in Firestore");
          setError("");
        }
      } catch (backendError) {
        console.warn("⚠️ Backend connection failed:", backendError.message);
        console.log("But image was saved to Firestore successfully!");
        
        // Set a mock prediction for demonstration
        setPrediction({
          disease: "Backend Not Available",
          confidence: 0,
          severity: "Unknown",
          description: "The AI backend is currently offline. Your image has been saved and will be analyzed once the backend is available.",
          treatment: "Please ensure the Flask backend server is running on http://localhost:5000",
        });
      }

    } catch (err) {
      console.error("❌ Critical error:", err);
      setError(
        `Error: ${err.message}. However, if you see this message after 'saved to Firestore', your data WAS saved successfully.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setPrediction(null);
    setError("");
    setUploadSuccess(false);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100vh",
        width: "100vw",
        backgroundColor: "#f9fff6ff",
        fontFamily: "Poppins, sans-serif",
        padding: "40px 0",
        boxSizing: "border-box",
      }}
    >
      {showInstructions ? (
        <div
          className="card shadow-lg p-4 text-center"
          style={{ maxWidth: "650px", borderRadius: "20px" }}
        >
          <h2 className="fw-bold text-success mb-3"> <img src="/logo.png" alt=""  style={{ width: "40px", height: "40px", }}/> Welcome to TomatoCare</h2>
          <p className="text-muted mb-4">
            Please follow the instructions below before uploading your image for
            accurate detection:
          </p>

          <ul className="list-group list-group-flush text-start mb-4">
            <li className="list-group-item">✅ Ensure the leaf is clearly visible and in focus.</li>
            <li className="list-group-item">✅ Capture the image in good natural light (avoid glare).</li>
            <li className="list-group-item">✅ Only one leaf should be visible (avoid multiple leaves).</li>
            <li className="list-group-item">✅ Avoid blurry or zoomed-out images.</li>
          </ul>

          <button
            className="btn btn-success px-4 py-2 fw-bold rounded-pill"
            onClick={() => setShowInstructions(false)}
          >
            Proceed to Upload →
          </button>
        </div>
      ) : (
        <div
          className="container bg-white p-4 rounded shadow-lg"
          style={{ maxWidth: "900px" }}
        >
          <h2 className="text-center fw-bold mb-3 text-success">
            <img src="/logo.png" alt=""  style={{ width: "40px", height: "40px", }}/> TomatoCare – Disease Detection
          </h2>
          <p className="text-center text-muted mb-4">
            Upload a clear image of your tomato leaf to detect potential diseases using AI.
          </p>

          {error && (
            <div className={`alert ${uploadSuccess ? 'alert-info' : 'alert-danger'} alert-dismissible fade show`} role="alert">
              {uploadSuccess ? '💾' : '⚠️'} {error}
              <button type="button" className="btn-close" onClick={() => setError("")}></button>
            </div>
          )}

          {uploadSuccess && !error && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              ✅ Image uploaded successfully! Data saved to Firestore.
              <button type="button" className="btn-close" onClick={() => setUploadSuccess(false)}></button>
            </div>
          )}

          <div className="row g-4">
            {/* Upload Section */}
            <div className="col-md-6 text-center">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleInputChange}
                style={{ display: "none" }}
              />

              <div
                className={`border border-3 rounded-4 p-4 ${
                  preview ? "border-success bg-light" : "border-secondary"
                }`}
                style={{ cursor: "pointer", height: "280px" }}
                onClick={() => !uploading && fileInputRef.current?.click()}
              >
                {preview ? (
                  <>
                    <img
                      src={preview}
                      alt="Preview"
                      className="img-fluid rounded mb-3"
                      style={{ maxHeight: "200px", objectFit: "cover" }}
                    />
                    <p className="text-success fw-bold">✅ Image selected successfully!</p>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: "3rem" }}>📤</div>
                    <h5 className="fw-bold mt-2">Click here to upload tomato leaf image</h5>
                    <p className="text-muted">Upload a clear image for accurate detection</p>
                  </>
                )}
              </div>

              <button
                className="btn btn-primary w-100 mt-3 fw-bold"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {preview ? "Change Image" : "Choose Image File"}
              </button>

              <button
                className="btn btn-success w-100 mt-3 fw-bold"
                disabled={!selectedFile || loading || uploading}
                onClick={handlePredict}
              >
                {loading ? "🔄 Processing..." : "💾 Save to Firestore"}
              </button>

              {prediction && (
                <button
                  className="btn btn-outline-secondary w-100 mt-2"
                  onClick={handleReset}
                >
                  Analyze Another Image
                </button>
              )}

              {selectedFile && (
                <div className="mt-3 text-muted small bg-light p-2 rounded">
                  <strong>File:</strong> {selectedFile.name} <br />
                  <strong>Size:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className="col-md-6">
              {loading ? (
                <div className="text-center p-4">
                  <div
                    className="spinner-border text-success mb-3"
                    role="status"
                    style={{ width: "3rem", height: "3rem" }}
                  ></div>
                  <p className="text-muted">Processing and saving to Firestore...</p>
                </div>
              ) : prediction ? (
                <div className="card border-success p-3">
                  <h5 className="text-success fw-bold">📊 Analysis Result</h5>
                  <p>
                    <strong>Status:</strong> {prediction.disease}
                  </p>
                  {prediction.confidence > 0 && (
                    <>
                      <p>
                        <strong>Confidence:</strong> {prediction.confidence}%
                      </p>
                      <div className="progress mb-3">
                        <div
                          className="progress-bar bg-success"
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </>
                  )}
                  <p>
                    <strong>Severity:</strong>{" "}
                    <span className="badge bg-warning text-dark">
                      {prediction.severity}
                    </span>
                  </p>
                  <p className="mb-1 fw-bold">Information:</p>
                  <p className="text-muted">{prediction.treatment}</p>

                  <div className="alert alert-info mt-3 small">
                    💾 This scan has been saved to Firestore.
                  </div>
                </div>
              ) : (
                <div className="text-center p-4 text-muted">
                  <div style={{ fontSize: "3rem" }}>🔬</div>
                  <p className="fw-bold mt-2">Ready for Upload</p>
                  <p>Upload an image to save to Firestore Database</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleUploadPage;