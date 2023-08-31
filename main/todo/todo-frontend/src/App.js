import {useState, useEffect} from 'react';
import './App.css';

function StickyNote({handleClick, task, content}) {
  return (
    <div className='note' onClick={handleClick}> 
      <h3> {task} </h3>
      <p> {content} </p>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);
  const notes = [];

  // retrieve user data onload
  useEffect(() => {
    let SS = getSS();
    if (SS === '') {
      window.location.href = '/todo/login';
      return;
    }
    fetch('get-tasks', {
      method: 'POST', 
      body: JSON.stringify({
        'SS': SS
      }), 
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      res => res.json()
    ).then(
      data => {
        updateTasks(data['tasks']);
        console.log('hi');
      }
    ).catch(
      err => {
        window.alert('An error occured please login again.');
        window.location.href = '/todo/login';
        setSS('', true);
      }
    )
  }, []);

  function handleClick(task) {
    fetch('remove-task', {
      method: 'POST', 
      body: JSON.stringify({
        'SS': getSS(),
        'task': tasks[task]['task'], 
        'content': tasks[task]['content']
      }), 
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      res => res.json()
    ).then(
      data => {
        updateTasks(data['tasks'])
      }
    )
  }
  
  for (let item in tasks) {
    notes.push(
      <StickyNote handleClick={() => handleClick(item)} task={tasks[item]['task']} content={tasks[item]['content']}/>
    );
  }

  function addTask() {
    let task = window.prompt('Enter the name of the task');
    let content = window.prompt('Write some notes about the task');
    fetch('add-task', {
      method: 'POST', 
      body: JSON.stringify({
        'task': task, 
        'content': content, 
        'SS': getSS()
      }), 
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      res => res.json()
    ).then(
      data => {
        updateTasks(data['tasks']);
      }
    )
  }

  function updateTasks(data) {
    let allTasks = {};
    for (let task in data) {
      allTasks[task] = {'task': task, 'content': data[task]}
    }
    setTasks(allTasks);
  }
  
  function logOut() {
    setSS('', true);
    window.location.href = '/todo/login';
  }

  return (
    <> 
      <h1> {`My Tasks`} </h1>
      <div className='main'> 
        {notes}
      </div> <br/>
      <button onClick={() => {addTask()}}> Add Task </button>
      <button onClick={() => {logOut()}}> Log Out</button>
    </>
  );
}

function setSS(newValue, expired=false) {
  let date = new Date();
  date.setTime(date.getTime() + (expired ? (7 * 24 * 60 * 60 * 1000 * -1) : (7 * 24 * 60 * 60 * 1000))); 
  document.cookie = `SS=${newValue};${date};path=/;SameSite=secure`;
  console.log(document.cookie);
}

function getSS() {
  let name = 'SS='; 
  console.log(document.cookie);
  let allCookies = document.cookie.split(';');
  let bestSoFar = '';
  for (let i=0;i<allCookies.length; i++) {
      let c = allCookies[i];
      // remove whitespace
      if (c.charAt(0) === ' ') {
          c = c.substring(1);
      }
      // if cookie name matches the name we're looking for
      if (c.substring(0,name.length) === name) {
          let currentSS = c.substring(name.length, c.length);
          bestSoFar = currentSS.length > bestSoFar.length ? currentSS : bestSoFar;
      }
  }
  return bestSoFar;
}

export default App;
