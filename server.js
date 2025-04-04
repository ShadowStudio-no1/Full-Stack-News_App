const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT ||3000;

// Enable CORS for all routes
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Sample news data for development
const sampleNews = {
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
        },
        {
            source: { id: "sample-3", name: "Sample News 3" },
            author: "Mike Johnson",
            title: "Sports: Championship Finals Set",
            description: "The stage is set for an epic championship showdown between top teams.",
            url: "https://example.com/news3",
            urlToImage: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=600",
            publishedAt: new Date().toISOString(),
            content: "The championship finals are set to begin next week..."
        },
        {
            source: { id: "sample-4", name: "Sample News 4" },
            author: "Sarah Wilson",
            title: "Entertainment: New Movie Breaks Records",
            description: "Latest blockbuster film shatters box office records worldwide.",
            url: "https://example.com/news4",
            urlToImage: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=600",
            publishedAt: new Date().toISOString(),
            content: "The latest blockbuster has broken all previous records..."
        },
        {
            source: { id: "sample-5", name: "Sample News 5" },
            author: "David Brown",
            title: "Health: Breakthrough in Medical Research",
            description: "Scientists announce major breakthrough in medical research.",
            url: "https://example.com/news5",
            urlToImage: "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=600",
            publishedAt: new Date().toISOString(),
            content: "A team of researchers has made a significant breakthrough..."
        }
    ]
};

// Proxy endpoint for news API
app.get('/api/news/*', async (req, res) => {
    try {
        const apiPath = req.params[0];
        const apiKey = req.query.apiKey;
        // Remove apiKey from query params
        const query = { ...req.query };
        delete query.apiKey;
        const queryString = new URLSearchParams(query).toString();
        
        // Use sample data when rate limited
        console.log('Using sample news data due to rate limiting');
        res.json(sampleNews);
        
        /* Uncomment this when you have a valid API key or upgraded plan
        const url = `https://newsapi.org/v2/${apiPath}?${queryString}`;
        console.log('Fetching news from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-Api-Key': apiKey,
                'Accept': 'application/json',
                'User-Agent': 'news-app/1.0'
            }
        });
        
        const data = await response.json();
        console.log('NewsAPI response:', data);
        
        if (data.status === 'error') {
            console.error('NewsAPI error:', data.message);
            res.status(400).json(data);
            return;
        }
        
        res.json(data);
        */
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).json({ 
            status: 'error',
            message: error.message || 'Failed to fetch news'
        });
    }
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
