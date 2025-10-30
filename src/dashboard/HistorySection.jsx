import React, { useState, useEffect } from "react";

const HistorySection = () => {
  // Simulate database fetch; empty array for now
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Later, you can fetch the user's history from your database here
    // Example:
    // fetch('/api/user/history')
    //   .then(res => res.json())
    //   .then(data => setHistory(data));
  }, []);

  return (
    <div className="mt-4">
      {history.length === 0 ? (
        <div 
          className="card"
          style={{ 
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            height: "280px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div className="card-body d-flex flex-column justify-content-center align-items-center text-center" style={{ padding: "24px" }}>
            <h6 className="fw-bold mb-3 align-self-start" style={{ fontSize: "16px" }}>Recent History</h6>
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <div style={{ fontSize: "40px", color: "#ccc", marginBottom: "10px" }}>
                📊
              </div>
              <p className="text-muted mb-0">No search history found</p>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="card" 
          style={{ 
            borderRadius: "12px",
            border: "1px solid #e0e0e0",
            height: "280px",
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div className="card-body p-0" style={{ overflow: "auto" }}>
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: "12px 15px", fontWeight: "600" }}>Image</th>
                    <th style={{ padding: "12px 15px", fontWeight: "600" }}>Disease Detected</th>
                    <th style={{ padding: "12px 15px", fontWeight: "600" }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item, index) => (
                    <tr key={index}>
                      <td style={{ padding: "12px 15px" }}>
                        <img
                          src={item.image}
                          alt="Scan"
                          style={{ 
                            width: "50px", 
                            height: "50px", 
                            objectFit: "cover",
                            borderRadius: "8px" 
                          }}
                        />
                      </td>
                      <td style={{ padding: "12px 15px", verticalAlign: "middle" }}>
                        {item.disease}
                      </td>
                      <td style={{ padding: "12px 15px", verticalAlign: "middle" }}>
                        {item.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorySection;