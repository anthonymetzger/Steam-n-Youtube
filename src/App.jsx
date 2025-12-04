import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container } from 'react-bootstrap';
import SteamAPI from './SteamAPI.jsx';
import YoutubeAPI from './YoutubeAPI.jsx';
import axios from 'axios';
import config from './config';

const App = () => {
  const STEAM_API_KEY = config.STEAM_API_KEY;
  const YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;

  const [trendingGames , setTrendingGames] = useState([]);
  const [selectedGameTitle, setSelectedGameTitle] = useState('');
  const [youtubeVideos, setYoutubeVideos] = useState([]);

  const fetchTrendingGames = async () => {
    try {
      const response = await axios.get(`/api/featured/`);
      setTrendingGames(response.data.featured_win); 
    } catch (error) {
      console.error('Error fetching trending games:', error);
    }
  }

  useEffect(() => {
    fetchTrendingGames();
  }, []);

  useEffect(() => {
    if (trendingGames.length > 0) {
      console.log(logAvailableData());
    }
  });

  const logAvailableData = () => {
    if(trendingGames === undefined || trendingGames.length === 0){
      return 0;
    }
    console.log('Trending Games:', trendingGames);
    return trendingGames;
  }
  
  const gamesPerSlide = 5;
  const slides = [];

  for (let i = 0; i < trendingGames.length; i += gamesPerSlide) {
    slides.push(trendingGames.slice(i, i + gamesPerSlide));
  }

 return (
  <div className="app-container">
    <h1 className="app-title">These Games are HOT!!!</h1>
    
    <div className="carousel-container">
      <div id='carouselGamesCards' className='carousel slide' data-bs-ride="false" data-bs-interval="false">
        <div className='carousel-inner'>
          {slides.map((slideGames, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
              <div className="w-100 d-flex justify-content-center">
                <SteamAPI 
                  id={slideGames}
                  onGameSelect={(game) => setSelectedGameTitle(game.name)}
                />
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-control-prev" 
          type="button" 
          data-bs-target="#carouselGamesCards" 
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button 
          className="carousel-control-next" 
          type="button" 
          data-bs-target="#carouselGamesCards" 
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
    
 
  </div>
);
};

export default App;