import {useState, useEffect} from 'react';
import {setSS, getSS} from '/static/js/ss.js'

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
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const notes = [];

  // retrieve user data onload
  useEffect(() => {
    let SS = getSS();
    if (SS === '') window.location.href = '/todo/login';

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
        setUsername(data['username']);
        let allTasks = data['tasks'].map((task) => {
          return {'task': task, 'content': data['tasks'][task]}
        }); 
        setTasks(allTasks);
      }
    )
  }, []);

  function handleClick(task) {

  }
  
  for (let item in tasks) {
    notes.push(
      <StickyNote handleClick={() => handleClick(item)} task={tasks[item]['tasks']} content={tasks[item]['content']}/>
    );
  }

  return (
    <> 
      <h1> {`${username}'s Tasks`} </h1>
      <div className='main'> 
        {notes}
      </div>
    </>
  );
}

export default App;
