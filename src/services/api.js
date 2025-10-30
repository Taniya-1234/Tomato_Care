// src/services/api.js
// API service for communicating with Flask backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class TomatoDiseaseAPI {
  /**
   * Check if the backend API is healthy
   */
  static async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      if (!response.ok) throw new Error('Health check failed');
      return await response.json();
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  /**
   * Get list of detectable disease classes
   */
  static async getClasses() {
    try {
      const response = await fetch(`${API_BASE_URL}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      return await response.json();
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  /**
   * Predict disease from file upload
   * @param {File} imageFile - The image file to analyze
   * @returns {Promise<Object>} Prediction results
   */
  static async predictFromFile(imageFile) {
    try {
      if (!imageFile) {
        throw new Error('No image file provided');
      }

      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/predict`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  /**
   * Predict disease from base64 encoded image
   * @param {string} base64Image - Base64 encoded image data
   * @returns {Promise<Object>} Prediction results
   */
  static async predictFromBase64(base64Image) {
    try {
      if (!base64Image) {
        throw new Error('No image data provided');
      }

      const response = await fetch(`${API_BASE_URL}/predict_base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Prediction failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  /**
   * Convert file to base64 string
   * @param {File} file - The file to convert
   * @returns {Promise<string>} Base64 encoded string
   */
  static async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:image/png;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
    });
  }
}

export default TomatoDiseaseAPI;