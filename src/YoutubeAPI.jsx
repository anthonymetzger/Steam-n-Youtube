import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SteamAPI from './SteamAPI.jsx';
import { Container } from 'react-bootstrap';
import VideoList from './VideoList.jsx';
import { useState, useEffect } from 'react';

let apiKey = 'AIzaSyBx948gtfes2qINaOHMcFMvQAdhihLeWP4';
              









const youtubeAPI = ({ id, name }) => {

 


  console.log(`YoutubeAPI received name:, ${name} and id: ${id}`);
  
  



  return (
    <>
      
      
      <script src="https://www.youtube.com/iframe_api"></script>
    </>
  );
};

export default youtubeAPI;

