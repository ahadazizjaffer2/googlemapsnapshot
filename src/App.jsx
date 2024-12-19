import React from 'react';
import Map from './components/Map';
import './styles.css';

const App = () => {
  return (
    <div className="App p-4">
      <h1 className="text-4xl font-bold text-center my-2 ">
        Google Maps Snapshot
      </h1>
      <Map />
    </div>
  );
};

export default App;
