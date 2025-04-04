
# 🌐 Modern News App with Live TV

A fully-featured full-stack **News Application** with Live TV Streaming, Real-Time Weather Updates, and a polished, responsive, and interactive user interface. Built using **Node.js**, **Express**, and **Vanilla JavaScript**, this app delivers fast, reliable, and user-friendly content consumption across all devices.

![News App Screenshot](https://raw.githubusercontent.com/ShadowStudio-no1/Full-Stack-News_App/refs/heads/main/images/privew1.png)

---

## 🚀 Core Features

### 📰 News Section
- Real-time news updates using **NewsAPI**
- Dynamic category-based filtering (sports, business, entertainment, etc.)
- Search functionality for any topic or keyword
- Responsive card-based news grid layout
- Interactive modals for full article views
- Social media sharing integration
- Image lazy loading, cache optimization, and error fallback handling

### 📺 Live TV Streaming
- Multiple national and international live news channels
- Integrated **HLS.js** custom video player
- Manual/auto video quality selection (Auto/High/Medium/Low)
- Stream health monitoring and auto-retry support
- Channel metadata and overlay information display
- Hotkeys for enhanced accessibility (Play/Pause, Fullscreen, Volume)
- Fully responsive, mobile-optimized player with touch gestures

### ☁️ Weather Widget
- Real-time, geolocation-based weather data using **OpenWeatherMap API**
- Auto-detect user's location and show relevant forecast
- Dynamic weather icon rendering and animated transitions
- Clean display of temperature, weather conditions, and city name

### 🧑‍🎨 UI/UX Highlights
- Dark/Light mode with persistent user settings
- Smooth transitions, loading skeletons, and micro-interactions
- Fully responsive design using a mobile-first approach
- Seamless theme switching, hover effects, and touch responsiveness
- Error handling for API failures and poor network conditions

---

## 🎓 Tech Stack & Tools Used

| Technology        | Logo                                                                 |
|-------------------|----------------------------------------------------------------------|
| HTML5             | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) |
| CSS3              | ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)  |
| JavaScript (ES6+) | ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |
| Node.js           | ![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) |
| Express.js        | ![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) |
| HLS.js            | ![HLS.js](https://img.shields.io/badge/HLS.js-FF9900?style=for-the-badge&logo=hulu&logoColor=white) |
| Font Awesome      | ![FontAwesome](https://img.shields.io/badge/Font%20Awesome-339AF0?style=for-the-badge&logo=fontawesome&logoColor=white) |
| Render            | ![Render](https://img.shields.io/badge/Render-3D348B?style=for-the-badge&logo=render&logoColor=white) |
| Vercel            | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white) |
| Git + GitHub      | ![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white) |

---

## ⚙️ Installation & Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/modern-news-app.git
cd modern-news-app
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root:
```env
PORT=3000
NEWS_API_KEY=your_news_api_key_here
WEATHER_API_KEY=your_openweather_api_key_here
```

### 4. Run Locally
```bash
npm start
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment Guide (Free Hosting)

### 📱 Backend Deployment on [Render](https://render.com)

1. Create a new public GitHub repository with only the backend files:
    - `server.js`
    - `package.json`
    - `.env` (don't upload this, add keys in Render Dashboard later)

2. Go to [render.com](https://render.com), sign in with GitHub, and click **"New Web Service"**.
3. Select your backend repo and configure:
    - Build Command: `npm install`
    - Start Command: `node server.js`
    - Runtime: Node
4. Add **Environment Variables**:
    - `NEWS_API_KEY` = `your_key`
    - `WEATHER_API_KEY` = `your_key`
5. Deploy and get your backend URL like `https://news-api-backend.onrender.com`

### 🌐 Frontend Deployment on [Vercel](https://vercel.com)

1. Push your frontend files (`index.html`, `style.css`, `app.js`, etc.) into a separate GitHub repo.
2. Login to [vercel.com](https://vercel.com), click **New Project**, and select your frontend repo.
3. Set publish directory as `./` (if files are at root).
4. Deploy and get a frontend URL like `https://modern-news-app.vercel.app`

### 🔧 Final Step: Link Frontend to Backend
In `app.js`, replace this line:
```js
const NEWS_BASE_URL = 'http://localhost:3000/api/news';
```
with:
```js
const NEWS_BASE_URL = 'https://news-api-backend.onrender.com/api/news';
```

---

## 📱 Mobile Support
- Mobile-first responsive layout
- Touch-friendly video controls and buttons
- Performance optimized for low-end devices
- Lazy loading and caching for faster experience

---

## 🛄 Contribution Workflow
1. Fork this repository
2. Create a new feature branch
3. Push your changes
4. Open a Pull Request with detailed description

---

## 🧪 License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more info.

---

## 🙏 Credits
- NewsAPI
- OpenWeatherMap
- HLS.js
- Font Awesome
- Render and Vercel for free hosting

---

> Built with ❤️ by [Shadow Studio Agency](https://shadowstudio.in)


