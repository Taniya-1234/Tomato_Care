import React from "react";
import UploadLeafCard from "./UploadSection";
import HistorySection from "./HistorySection";
import DiseaseDetected from "./components/DiseaseDetected";
import WeatherCard from "./components/WeatherCard";

const DashboardHome = () => {
  return (
    <div
      className="dashboardHome"
      style={{ 
        marginTop: "70px",
        marginLeft: "350px",
        padding: "40px 50px",
        backgroundColor: "#ffffff",
        minHeight: "calc(100vh - 70px)",
        width: "calc(100% - 250px)"
      }}
    >
      <div className="mb-4">
        <h3 className="fw-bold mb-2" style={{ color: "#2e7d32", textAlign:"center"}}>
          Welcome to TomatoCare 
        </h3>
        <p className="text-muted mb-0" style={{textAlign:"center"}}>
          Analyze your tomato plants and track your previous scans easily.
        </p>
      </div>

      <div className="row" style={{ gap: "30px" }}>
        {/* Left Column - Upload & History */}
        <div className="col-lg-6" style={{ flex: 1 }}>
          <div className="mb-4">
            <UploadLeafCard />
          </div>
          <HistorySection />
        </div>

        {/* Right Column - Weather & Disease */}
        <div className="col-lg-6" style={{ flex: 1 }}>
          <div className="mb-4">
            <WeatherCard />
          </div>
          <DiseaseDetected />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;