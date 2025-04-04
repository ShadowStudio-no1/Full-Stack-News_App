# Modern News App with Live TV

A full-stack news application with live TV streaming, real-time weather updates, and a modern user interface. Built with Node.js, Express, and vanilla JavaScript.

![News App Screenshot](screenshots/app-preview.png)

## 🚀 Features

### News Section
- Real-time news updates via NewsAPI
- Category-based news filtering
- Advanced search functionality
- Responsive news grid layout
- News article modal with sharing options
- Image lazy loading and caching
- Fallback data handling

### Live TV Section
- Multiple news channels streaming
- Custom video player controls
- Quality selection (Auto/High/Medium/Low)
- Stream health monitoring
- Channel information overlay
- Keyboard shortcuts for playback
- Mobile-optimized controls

### Weather Widget
- Real-time weather updates
- Location-based weather data
- Dynamic weather icons
- Temperature and conditions display

### UI/UX Features
- Dark/Light theme toggle
- Responsive design for all devices
- Modern animations and transitions
- Loading states and error handling
- Touch-friendly interface

## 🛠️ Technical Stack

### Frontend
- Vanilla JavaScript (ES6+)
- CSS3 with Custom Properties
- HTML5 with Semantic Elements
- HLS.js for video streaming
- Font Awesome icons
- Custom video player implementation

### Backend
- Node.js
- Express.js
- CORS support
- Environment variable configuration
- Static file serving
- API proxying and caching

### APIs Used
- NewsAPI for news content
- OpenWeatherMap for weather data
- HLS streams for live TV

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/modern-news-app.git
cd modern-news-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create a \`.env\` file in the root directory:
\`\`\`env
PORT=3000
NEWS_API_KEY=your_news_api_key
WEATHER_API_KEY=your_weather_api_key
\`\`\`

4. Start the server:
\`\`\`bash
npm start
\`\`\`

5. Open http://localhost:3000 in your browser

## 🎮 Usage

### Video Player Controls
- Space: Play/Pause
- M: Mute/Unmute
- F: Toggle Fullscreen
- Click on video: Play/Pause
- Progress bar: Seek through video
- Volume slider: Adjust volume

### News Navigation
- Click category buttons to filter news
- Use search bar for specific topics
- Click news cards to view details
- Share buttons in news modal
- Theme toggle in header

## 📱 Mobile Support
- Responsive design works on all devices
- Touch-optimized video controls
- Swipe gestures for navigation
- Optimized images for mobile
- Mobile-first approach

## 🔧 Configuration

### Environment Variables
- \`PORT\`: Server port (default: 3000)
- \`NEWS_API_KEY\`: Your NewsAPI key
- \`WEATHER_API_KEY\`: Your OpenWeatherMap key

### API Endpoints
- \`/api/news\`: Get news articles
- \`/api/news/search\`: Search news
- \`/api/weather\`: Get weather data

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments
- NewsAPI for news data
- OpenWeatherMap for weather data
- HLS.js for video streaming
- Font Awesome for icons
