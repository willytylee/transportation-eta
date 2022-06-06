import {useState, useEffect} from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';
import {Navbar} from './Navbar'
import {Willy} from './pages/Willy'
import {Shan} from './pages/Shan'
import {Route, Routes} from "react-router-dom"

const App = () => {

  return (
    <> 
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Willy />} />
          <Route path="/willy" element={<Willy />} />
          <Route path="/shan" element={<Shan />} />
        </Routes>
        <div className="refresh-wrapper">
          <button onClick={() => window.location.reload()}>Refresh to update the app</button>
        </div>
      </div>
    </>
  );
}

export default App;
