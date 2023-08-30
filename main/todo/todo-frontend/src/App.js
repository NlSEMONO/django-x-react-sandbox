import {useState, useEffect} from 'react';
import './App.css';

function StickyNote({handleClick, task, content}) {
  return (
    <div className='note' onClick={handleClick}> 
      <h1> {task} </h1>
      <p> {content} </p>
    </div>
  );
}

function App() {
  useEffect(() => {
  }) 
  return (
    <>
      
    </>
  );
}

export default App;
