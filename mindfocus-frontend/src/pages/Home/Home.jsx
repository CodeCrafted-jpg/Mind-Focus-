import React from 'react';
import Headers from '../../components/headers/headers';
import Features from '../../components/features/features';
import './Home.css'; 
import { Link } from 'react-router-dom';


const Home = () => {
  return (
    <div className="home-container">
      <Headers />
      <Link to={'/focus'}className="buttonLInk" >
      <button className="button">
      
        Get Started🎯</button></Link>
      <Features />
    </div>
  );
};

export default Home;
