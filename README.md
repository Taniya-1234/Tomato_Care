# 🍅 Tomato Care

A web-based platform built to assist farmers and agricultural enthusiasts by providing **real-time weather updates**, **agriculture news**, and **image upload features** for crop analysis.

> ⚠️ **Note:** This project currently represents the **frontend part only**. Database and backend integration are not yet implemented. Future versions will include complete backend functionality.

---

## 🚀 Features

### 🔐 User Authentication (Firebase)
- Secure **Sign In** and **Sign Out** functionality using Firebase Authentication
- Efficient user session management
- Data storage handled through Firebase Storage for uploaded images

> 🧾 **Important:** This project is for demonstration purposes. Please use **dummy email and password credentials** while testing. Do **not** use any personal or sensitive information.

### 🖼️ Image Upload & Storage
- Upload images through an intuitive interface
- Automatic conversion to Base64 format for internal processing
- Secure storage in Firebase Storage

### 🌦️ Weather Information (OpenWeatherMap API)
- Real-time weather data based on user location
- Display temperature, humidity, weather conditions, and wind speed
- Helps farmers plan agricultural activities

### 📰 Live Agricultural News (GNews API)
- Latest agriculture and farming-related news
- Auto-refreshes every 30 minutes
- Displays relevant global agriculture headlines

---

## 🧠 Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React.js, Bootstrap |
| **APIs** | OpenWeatherMap API, GNews API |
| **Authentication** | Firebase Authentication |
| **Storage** | Firebase Storage |
| **Language** | JavaScript (ES6) |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/tomato_care.git
cd tomato_care
npm install
```

### 2️⃣ Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Add your Firebase config keys inside a new file named `firebaseConfig.js`

### 3️⃣ Add API Keys

Get your API keys:
- OpenWeatherMap: [https://openweathermap.org/api](https://openweathermap.org/api)
- GNews: [https://gnews.io/](https://gnews.io/)

Create a `.env` file in the root directory:

```bash
REACT_APP_WEATHER_API_KEY=your_openweathermap_api_key
REACT_APP_GNEWS_API_KEY=your_gnews_api_key
```

### 4️⃣ Run the App

```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 📋 How It Works

1. **User Login**
   - Users sign in using Firebase Authentication (dummy credentials)
   - Firebase manages authentication sessions

2. **Image Upload**
   - User uploads an image → converted to Base64 → stored in Firebase Storage

3. **Weather Search**
   - User searches a city → OpenWeatherMap API returns weather details

4. **News Updates**
   - GNews API fetches agriculture-related articles every 30 minutes automatically

---

## 🔮 Future Enhancements

- 🤖 AI-based plant disease detection from uploaded images
- 🌾 Personalized crop recommendations
- 🌍 Multi-language support for rural users
- 💾 Complete backend integration with database
- 📊 Advanced analytics and insights for farmers

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Taniya-1234/Tomato_Care/issues).

---

