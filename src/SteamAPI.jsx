import 'bootstrap/dist/css/bootstrap.min.css';
import './SteamAPI.css';
import React from 'react';
import axios from 'axios';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import YoutubeAPI from './YoutubeAPI.jsx';
import config from './config';

const YOUTUBE_API_KEY = config.YOUTUBE_API_KEY;


const steamGame = ({ id, onGameSelect }) => {

  const [youtubeData, setYoutubeData] = useState({});
  const [selectedGame, setSelectedGame] = useState(null);

  function changeBGColor(name){
    return name.discounted ? 'game-card-discounted' : 'game-card-regular';
  }

  const fetchYoutubeVideos = async (gameTitle, gameId) => {
    console.log('Fetching videos for:', gameTitle);
    try {
      const response = await axios.get(`/youtube/youtube/v3/search`, {
        params: {
          part: 'snippet',
          maxResults: 5,
          q: `${gameTitle} before you buy`,
          key: YOUTUBE_API_KEY,
          type: 'video',
        },
      });
      console.log('YouTube response:', response.data);
      
      if (response.data.items) {
        const parsedVideos = response.data.items.map(item => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.medium.url,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`
        }));
        
        setYoutubeData(prev => ({
          ...prev,
          [gameId]: parsedVideos
        }));
        setSelectedGame(gameId);
      }
    } catch (error) {
      console.error('Error fetching YouTube videos:', error);
      return [];
    }
  };
  
  
  return(
    <>
      <div className="w-100">
        <div className='row g-2 steam-cards-row justify-content-center'>
          {id.map((game) => (
            <div key={game.id} className='col-lg-2 col-md-3 col-sm-4'>
              <div 
                className={`card h-100 game-card ${changeBGColor(game)}`}
                onClick={() => {
                  console.log(game.id);
                  fetchYoutubeVideos(game.name, game.id);
                  onGameSelect(game);
                }}
              >
                {game.header_image && (
                  <img 
                    src={game.header_image} 
                    className='card-img-top game-card-img' 
                    alt={game.name}
                  />
                )}
                <div className='card-body game-card-body'>
                  <h6 className='game-card-title'>
                    {game.name}
                  </h6>
                  <p className='game-discount-info'>
                    <strong>Discount:</strong> {game.discounted ? 'Yes' : 'No'}
                  </p>
                  {game.discount_percent > 0 && (
                    <p className='text-success game-discount-percent'>
                      -{game.discount_percent}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* YouTube Videos Panel - Carousel from Bottom with 3 videos per slide */}
{selectedGame && youtubeData[selectedGame] && (
  <div className="youtube-bottom-panel">
    <div className="youtube-panel-header">
      <h4 className="youtube-panel-title">Related Videos</h4>
      <button 
        className="btn-close youtube-close-btn" 
        onClick={() => setSelectedGame(null)}
      ></button>
    </div>
    
    <div id="youtubeCarousel" className="carousel slide youtube-carousel-container" data-bs-ride="false" data-bs-interval="false">
      <div className="carousel-inner youtube-carousel-inner">
        {(() => {
          const videosPerSlide = 3;
          const videos = youtubeData[selectedGame];
          const numSlides = Math.ceil(videos.length / videosPerSlide);
          
          return Array.from({ length: numSlides }).map((_, slideIndex) => {
            const startIdx = slideIndex * videosPerSlide;
            const slideVideos = videos.slice(startIdx, startIdx + videosPerSlide);
            
            return (
              <div key={slideIndex} className={`carousel-item youtube-carousel-item ${slideIndex === 0 ? 'active' : ''}`}>
                <div className="youtube-videos-grid">
                  {slideVideos.map((video, idx) => (
                    
                    <a  key={startIdx + idx}
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="youtube-video-card"
                    >
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="youtube-card-thumbnail"
                      />
                      <div className="youtube-card-body">
                        <p className="youtube-card-title">{video.title}</p>
                        <p className="youtube-card-channel">{video.channelTitle}</p>
                        <p className="youtube-card-date">
                          {new Date(video.publishedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            );
          });
        })()}
      </div>
      
      {/* Carousel Controls */}
      {youtubeData[selectedGame].length > 3 && (
        <>
          <button 
            className="carousel-control-prev youtube-carousel-prev" 
            type="button" 
            data-bs-target="#youtubeCarousel" 
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button 
            className="carousel-control-next youtube-carousel-next" 
            type="button" 
            data-bs-target="#youtubeCarousel" 
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </>
      )}
      
      {/* Indicators */}
      {youtubeData[selectedGame].length > 3 && (
        <div className="carousel-indicators youtube-indicators">
          {Array.from({ length: Math.ceil(youtubeData[selectedGame].length / 3) }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              data-bs-target="#youtubeCarousel"
              data-bs-slide-to={idx}
              className={idx === 0 ? 'active' : ''}
              aria-current={idx === 0 ? 'true' : 'false'}
              aria-label={`Slide ${idx + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  </div>
)}
    </>
  )
}

export default steamGame;