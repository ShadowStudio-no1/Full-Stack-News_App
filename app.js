// API Keys and URLs
const NEWS_API_KEY = '9a50f84cf2284010b6f14f6b646a2407';
const WEATHER_API_KEY = 'e2908d5064691ef8e27d8ce3f8c13643';
const CHANNELS = {
    aajtak1: 'https://aajtaklive-amd.akamaized.net/hls/live/2014416/aajtak/aajtaklive/live_234p/chunks.m3u8',
    aajtak2: 'https://feeds.intoday.in/aajtak/api/master.m3u8',
    tez: 'https://tezlive-amd.akamaized.net/hls/live/2016145/gnt/gntlive/live_234p/chunks.m3u8',
    indiatoday: 'https://feeds.intoday.in/hltapps/api/master.m3u8'
};

// News API Base URL (local proxy)
const NEWS_BASE_URL = 'https://full-stack-news-app.onrender.com/api/news';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const newsGrid = document.getElementById('newsGrid');
const categoryButtons = document.querySelectorAll('.category-filters button');
const themeToggle = document.getElementById('themeToggle');
const videoPlayer = document.getElementById('videoPlayer');

// Modal Elements
const modal = document.getElementById('newsModal');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalSource = document.getElementById('modalSource');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const modalReadMore = document.getElementById('modalReadMore');
const modalShare = document.getElementById('modalShare');
const closeModal = document.querySelector('.close-modal');

// Current state
let currentCategory = 'general';
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    getCurrentLocation();
    loadNews(currentCategory);
    setupEventListeners();
    initializeVideoPlayer();
});

// Theme Management
function initializeTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = `<i class="fas fa-${currentTheme === 'light' ? 'moon' : 'sun'}"></i>`;
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggle.innerHTML = `<i class="fas fa-${currentTheme === 'light' ? 'moon' : 'sun'}"></i>`;
}

// Video Player
let currentHls = null;

// Custom video controls
const playPauseBtn = document.getElementById('playPauseBtn');
const muteBtn = document.getElementById('muteBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const progressBar = document.querySelector('.progress-bar');
const progressBarFilled = document.querySelector('.progress-bar-filled');
const progressBarLoaded = document.querySelector('.progress-bar-loaded');
const volumeSlider = document.querySelector('.volume-slider');
const volumeSliderFilled = document.querySelector('.volume-slider-filled');
const timeDisplay = document.getElementById('currentTime');

// Video control functions
function togglePlay() {
    if (videoPlayer.paused) {
        videoPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        videoPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function toggleMute() {
    videoPlayer.muted = !videoPlayer.muted;
    muteBtn.innerHTML = videoPlayer.muted ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
    volumeSliderFilled.style.width = videoPlayer.muted ? '0%' : (videoPlayer.volume * 100) + '%';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        videoPlayer.parentElement.requestFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
    } else {
        document.exitFullscreen();
        fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
    }
}

function updateProgress() {
    if (!videoPlayer.duration) return;

    const progress = (videoPlayer.currentTime / videoPlayer.duration) * 100;
    progressBarFilled.style.width = progress + '%';

    // Update buffered progress
    if (videoPlayer.buffered.length > 0) {
        const buffered = (videoPlayer.buffered.end(videoPlayer.buffered.length - 1) / videoPlayer.duration) * 100;
        progressBarLoaded.style.width = buffered + '%';
    }

    // Update time display
    const minutes = Math.floor(videoPlayer.currentTime / 60);
    const seconds = Math.floor(videoPlayer.currentTime % 60);
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function scrub(e) {
    e.stopPropagation();
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const scrubTime = pos * videoPlayer.duration;
    videoPlayer.currentTime = scrubTime;
}

function handleVolumeChange(e) {
    e.stopPropagation();
    const rect = volumeSlider.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const volume = Math.max(0, Math.min(1, pos));
    videoPlayer.volume = volume;
    volumeSliderFilled.style.width = (volume * 100) + '%';
    
    // Update mute button
    muteBtn.innerHTML = volume === 0 ? 
        '<i class="fas fa-volume-mute"></i>' : 
        '<i class="fas fa-volume-up"></i>';
    
    // Unmute if volume is changed
    if (volume > 0 && videoPlayer.muted) {
        videoPlayer.muted = false;
    }
}

function initializeVideoPlayer() {
    const channelButtons = document.querySelectorAll('.channel-btn');
    channelButtons.forEach(button => {
        button.addEventListener('click', () => {
            channelButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadChannel(button.dataset.channel);
        });
    });

    // Video control event listeners
    playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });
    muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMute();
    });
    fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFullscreen();
    });
    videoPlayer.addEventListener('timeupdate', updateProgress);
    progressBar.addEventListener('click', scrub);
    volumeSlider.addEventListener('click', handleVolumeChange);
    
    // Add play/pause on video click
    videoPlayer.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlay();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            togglePlay();
        } else if (e.code === 'KeyM') {
            toggleMute();
        } else if (e.code === 'KeyF') {
            toggleFullscreen();
        }
    });

    // Load default channel
    loadChannel('aajtak1');
}

function loadChannel(channelId) {
    const channelUrl = CHANNELS[channelId];
    if (!channelUrl) return;

    // Update channel info in the overlay
    const button = document.querySelector(`[data-channel="${channelId}"]`);
    const channelLogo = button.querySelector('img').src;
    const channelName = button.querySelector('span').textContent;
    
    document.getElementById('currentChannelLogo').src = channelLogo;
    document.getElementById('currentChannelName').textContent = channelName;

    // Add loading animation
    const videoContainer = document.querySelector('.video-container');
    videoContainer.classList.add('loading');

    if (currentHls) {
        currentHls.destroy();
        currentHls = null;
    }

    if (Hls.isSupported()) {
        currentHls = new Hls({
            debug: false,
            enableWorker: true,
            lowLatencyMode: true,
            manifestLoadingTimeOut: 20000,
            manifestLoadingMaxRetry: 3,
            manifestLoadingRetryDelay: 500,
            startLevel: -1, // Auto quality by default
        });
        
        currentHls.loadSource(channelUrl);
        currentHls.attachMedia(videoPlayer);

        // Setup quality selector
        const qualityMenu = document.querySelector('.quality-menu');
        const qualityBtn = document.getElementById('qualityBtn');
        
        qualityMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const quality = parseInt(e.target.dataset.quality);
                currentHls.currentLevel = quality;
                
                // Update UI
                qualityMenu.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                qualityBtn.querySelector('span').textContent = e.target.textContent;
                
                // Update stream quality indicator
                document.getElementById('streamQuality').textContent = 
                    quality === -1 ? 'Auto' : ['Low', 'Medium', 'High'][quality];
            }
        });

        currentHls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoPlayer.volume = 0.5;
            videoPlayer.play().catch(error => {
                console.log('Auto-play prevented:', error);
            });
            videoContainer.classList.remove('loading');

            // Initialize quality menu
            if (currentHls.levels.length > 1) {
                document.getElementById('streamQuality').textContent = 'Auto';
            }
        });

        // Monitor stream health
        let healthCheckInterval = setInterval(() => {
            if (!currentHls) {
                clearInterval(healthCheckInterval);
                return;
            }

            const stats = currentHls.stats;
            const buffered = videoPlayer.buffered;
            const latency = stats.fragLoadingTime;
            const dropped = stats.droppedFrames;

            // Update connection status
            let connectionStatus = 'Good';
            let healthStatus = 'Excellent';

            if (latency > 2000 || dropped > 30) {
                connectionStatus = 'Poor';
                healthStatus = 'Poor';
            } else if (latency > 1000 || dropped > 10) {
                connectionStatus = 'Fair';
                healthStatus = 'Good';
            }

            document.getElementById('connectionSpeed').textContent = connectionStatus;
            document.getElementById('streamHealth').textContent = healthStatus;
            document.getElementById('viewerCount').textContent = 
                Math.floor(Math.random() * 50000 + 10000).toLocaleString();
        }, 2000);

        currentHls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        console.log("Network error, trying to recover...");
                        document.getElementById('connectionSpeed').textContent = 'Poor';
                        document.getElementById('streamHealth').textContent = 'Poor';
                        currentHls.startLoad();
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        console.log("Media error, trying to recover...");
                        currentHls.recoverMediaError();
                        break;
                    default:
                        console.error("Fatal error, cannot recover:", data);
                        currentHls.destroy();
                        currentHls = null;
                        videoContainer.classList.add('error');
                        setTimeout(() => {
                            videoContainer.classList.remove('error');
                            loadChannel(channelId); // Try to reload
                        }, 5000);
                        break;
                }
            }
        });

        // Add quality selector if multiple qualities available
        currentHls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
            if (currentHls.levels.length > 1) {
                // Auto-select the best quality
                currentHls.currentLevel = -1;
            }
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = channelUrl;
        videoContainer.classList.remove('loading');
    }
}

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchNews(query);
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                searchNews(query);
            }
        }
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentCategory = button.dataset.category;
            loadNews(currentCategory);
        });
    });

    themeToggle.addEventListener('click', toggleTheme);

    // Modal event listeners
    closeModal.addEventListener('click', hideNewsModal);
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideNewsModal();
        }
    });

    modalShare.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: modalTitle.textContent,
                text: modalDescription.textContent,
                url: modalReadMore.href
            }).catch(console.error);
        }
    });
}

// Weather Functions
function getCurrentLocation() {
    try {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => getWeather(position.coords.latitude, position.coords.longitude),
                error => {
                    console.log('Using default location due to:', error.message);
                    getWeather(28.6139, 77.2090); // Default to New Delhi
                },
                {
                    enableHighAccuracy: false,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            console.log('Geolocation not supported, using default location');
            getWeather(28.6139, 77.2090); // Default to New Delhi
        }
    } catch (error) {
        console.error('Error in getCurrentLocation:', error);
        getWeather(28.6139, 77.2090); // Default to New Delhi
    }
}

async function getWeather(lat, lon) {
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        );
        const data = await response.json();
        updateWeatherUI(data);
    } catch (error) {
        console.error('Error fetching weather:', error);
        showError('Weather data temporarily unavailable');
    }
}

function updateWeatherUI(data) {
    const weatherIcon = document.querySelector('.weather-icon');
    const temp = document.querySelector('.temp');
    const location = document.querySelector('.location');
    const description = document.querySelector('.description');

    weatherIcon.className = 'weather-icon fas';
    weatherIcon.classList.add(getWeatherIcon(data.weather[0].main));
    temp.textContent = `${Math.round(data.main.temp)}°C`;
    location.textContent = data.name;
    description.textContent = data.weather[0].description;
}

function getWeatherIcon(weatherType) {
    const icons = {
        Clear: 'fa-sun',
        Clouds: 'fa-cloud',
        Rain: 'fa-cloud-rain',
        Snow: 'fa-snowflake',
        Thunderstorm: 'fa-bolt',
        Drizzle: 'fa-cloud-rain',
        Mist: 'fa-smog',
        Smoke: 'fa-smog',
        Haze: 'fa-smog',
        Dust: 'fa-smog',
        Fog: 'fa-smog',
        Sand: 'fa-smog',
        Ash: 'fa-smog',
        Squall: 'fa-wind',
        Tornado: 'fa-wind'
    };
    return icons[weatherType] || 'fa-cloud';
}

// News Functions
async function loadNews(category = 'general') {
    showLoading();
    try {
        console.log('Fetching news for category:', category); // Debug log
        const response = await fetch(`${NEWS_BASE_URL}/top-headlines?country=in&category=${category}&apiKey=${NEWS_API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('News API Response:', data); // Debug log
        
        if (data.status === 'error') {
            throw new Error(data.message || 'Error fetching news');
        }

        if (!data.articles || data.articles.length === 0) {
            showError('No articles available. Please try again later.');
            return;
        }

        displayNews(data.articles);
    } catch (error) {
        console.error('Error loading news:', error);
        showError('Failed to load news. Please try again later.');
    } finally {
        hideLoading();
    }
}

async function searchNews(query) {
    try {
        showLoading();
        
        const response = await fetch(`${NEWS_BASE_URL}/everything?q=${query}&apiKey=${NEWS_API_KEY}&language=en&sortBy=publishedAt&pageSize=20`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'Error fetching news');
        }

        if (!data.articles || data.articles.length === 0) {
            showError('No articles found for your search. Try different keywords.');
            return;
        }

        displayNews(data.articles);
    } catch (error) {
        console.error('Error searching news:', error);
        showError('Unable to search news at the moment. Please try again later.');
    } finally {
        hideLoading();
    }
}

async function displayNews(articles) {
    const container = document.querySelector('.news-container');
    const grid = document.getElementById('newsGrid');
    
    // Don't clear immediately, wait for new content
    const newGrid = document.createElement('div');
    newGrid.id = 'newsGrid';
    newGrid.className = 'news-grid';
    
    if (!articles || articles.length === 0) {
        showError('No news articles available at the moment.');
        return;
    }

    // Create all cards
    const cards = articles.map(article => {
        if (article.title) {
            return createNewsCard(article);
        }
        return null;
    }).filter(card => card !== null);

    // If no valid cards were created, show sample data
    if (cards.length === 0) {
        displayNews(getSampleNewsData());
        return;
    }

    // Add cards to the new grid
    cards.forEach(card => newGrid.appendChild(card));

    // Fade out old content
    container.classList.add('loading');
    await delay(300);

    // Replace old grid with new grid
    grid.replaceWith(newGrid);

    // Fade in new content
    await delay(50);
    container.classList.remove('loading');
}

function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.onclick = (e) => {
        e.preventDefault();
        showNewsModal(article);
    };

    const imageContainer = document.createElement('div');
    imageContainer.className = 'news-image-container';

    const img = document.createElement('img');
    img.className = 'news-image';
    img.alt = article.title;
    
    // Add loading animation
    const loadingSpinner = document.createElement('div');
    loadingSpinner.className = 'image-loading-spinner';
    imageContainer.appendChild(loadingSpinner);
    
    // Set image source with fallback
    if (article.urlToImage) {
        img.src = article.urlToImage;
        img.onerror = () => {
            img.src = 'https://placehold.co/600x400/png?text=No+Image';
            loadingSpinner.remove();
        };
        img.onload = () => {
            loadingSpinner.remove();
            img.classList.add('loaded');
        };
    } else {
        img.src = 'https://placehold.co/600x400/png?text=No+Image';
        loadingSpinner.remove();
    }
    
    imageContainer.appendChild(img);

    const content = document.createElement('div');
    content.className = 'news-content';

    const source = document.createElement('p');
    source.className = 'news-source';
    source.textContent = article.source.name;

    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = article.title;

    const description = document.createElement('p');
    description.className = 'news-description';
    description.textContent = article.description || 'No description available';

    const date = document.createElement('p');
    date.className = 'news-date';
    date.textContent = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    content.appendChild(source);
    content.appendChild(title);
    content.appendChild(description);
    content.appendChild(date);

    card.appendChild(imageContainer);
    card.appendChild(content);

    return card;
}

// Cache for preloaded images
const imageCache = new Map();

// Preload images function
function preloadImage(url) {
    if (!imageCache.has(url)) {
        const img = new Image();
        const promise = new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        img.src = url;
        imageCache.set(url, promise);
    }
    return imageCache.get(url);
}

// Preload images from articles
async function preloadArticleImages(articles) {
    const imagePromises = articles
        .filter(article => article.urlToImage)
        .map(article => preloadImage(article.urlToImage));
    
    await Promise.allSettled(imagePromises);
}

// Sample News Data for Fallback
function getSampleNewsData() {
    return [
        {
            title: "India's Technology Sector Shows Strong Growth",
            description: "The Indian technology sector continues to demonstrate robust growth with increasing digital adoption across industries.",
            urlToImage: "https://via.placeholder.com/400x200?text=Tech+News",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Tech Daily" }
        },
        {
            title: "New Environmental Initiatives Launched",
            description: "Government announces new environmental protection measures and sustainable development goals.",
            urlToImage: "https://via.placeholder.com/400x200?text=Environment+News",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Environment Today" }
        },
        {
            title: "Sports Update: Cricket Championship",
            description: "Latest updates from the ongoing cricket championship with highlights from recent matches.",
            urlToImage: "https://via.placeholder.com/400x200?text=Sports+News",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Sports Weekly" }
        },
        {
            title: "Business Markets Show Positive Trends",
            description: "Financial markets demonstrate positive growth with new economic policies taking effect.",
            urlToImage: "https://via.placeholder.com/400x200?text=Business+News",
            url: "#",
            publishedAt: new Date().toISOString(),
            source: { name: "Business Daily" }
        }
    ];
}

// UI Helper Functions
function showLoading() {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner">
                <div class="loading-text">Loading news...</div>
            </div>
        </div>
    `;
    document.querySelector('.news-container').classList.add('loading');
}

function hideLoading() {
    document.querySelector('.news-container').classList.remove('loading');
}

function showError(message) {
    const newsGrid = document.getElementById('newsGrid');
    newsGrid.innerHTML = `
        <div class="error-container">
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <div>${message}</div>
            </div>
        </div>
    `;
}

// Utility Functions
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Modal Functions
function showNewsModal(article) {
    modalTitle.textContent = article.title;
    modalDate.textContent = new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    modalSource.textContent = article.source.name;
    modalImage.src = article.urlToImage || 'https://placehold.co/600x400/png?text=No+Image';
    modalDescription.textContent = article.content || article.description || 'No content available';
    modalReadMore.href = article.url;

    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function hideNewsModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function hideNewsModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}
