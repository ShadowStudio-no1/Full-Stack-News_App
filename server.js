require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// News API endpoint
app.get('/api/news', async (req, res) => {
    try {
        const { category = 'general' } = req.query;
        const response = await fetch(
            `https://newsapi.org/v2/top-headlines?country=in&category=${category}&apiKey=${process.env.NEWS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message);
        }
        
        res.json(data);
    } catch (error) {
        console.error('News API Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch news',
            data: getSampleNewsData() // Fallback data
        });
    }
});

// News search endpoint
app.get('/api/news/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({
                status: 'error',
                message: 'Search query is required'
            });
        }

        const response = await fetch(
            `https://newsapi.org/v2/everything?q=${q}&sortBy=relevancy&apiKey=${process.env.NEWS_API_KEY}`
        );
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message);
        }
        
        res.json(data);
    } catch (error) {
        console.error('News Search Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to search news',
            data: getSampleNewsData() // Fallback data
        });
    }
});

// Weather API endpoint
app.get('/api/weather', async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            return res.status(400).json({
                status: 'error',
                message: 'Latitude and longitude are required'
            });
        }

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        
        if (data.cod !== 200) {
            throw new Error(data.message);
        }
        
        res.json(data);
    } catch (error) {
        console.error('Weather API Error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch weather data'
        });
    }
});

// Sample news data for development and fallback
function getSampleNewsData() {
    return {
        status: "ok",
        totalResults: 10,
        articles: [
            {
                source: { id: "sample-1", name: "Sample News 1" },
                author: "John Doe",
                title: "Breaking: Major Technology Breakthrough",
                description: "Scientists have made a groundbreaking discovery in quantum computing that could revolutionize the field.",
                url: "https://example.com/news1",
                urlToImage: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=600",
                publishedAt: new Date().toISOString(),
                content: "Scientists have made a groundbreaking discovery in quantum computing..."
            },
            {
                source: { id: "sample-2", name: "Sample News 2" },
                author: "Jane Smith",
                title: "Global Climate Initiative Launched",
                description: "World leaders announce ambitious new climate action plans at international summit.",
                url: "https://example.com/news2",
                urlToImage: "https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=600",
                publishedAt: new Date().toISOString(),
                content: "World leaders have announced ambitious new climate action plans..."
            }
        ]
    };
}

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Environment:', process.env.NODE_ENV || 'development');
});
