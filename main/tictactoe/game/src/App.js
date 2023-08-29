import {useState} from 'react';
import './App.css';

function Square({handleClick, value}) {
  return <button className='square' onClick={handleClick}> {value} </button>
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [status, setStatus] = useState('X Turn');
  const [winner, setWinner] = useState('');
  const userGrid = [];

  function cloneBoard(givenBoard) {
    let newBoard = [];
    for (let i=0;i<9;i++) newBoard.push(givenBoard[i]);
    return newBoard;
  }

  function handleClick(i) {
    console.log('hi');
    // block invalid inputs
    if (winner !== '' || board[i]) {
      return;
    }
    // if valid input, make the request to DB
    const options = {
      method: "POST", 
      body: JSON.stringify({
        'move': i
      }), 
      headers: {
        'content-type': 'application/json'
      },
      keepalive: false,
    };
    console.log(options);
    fetch('player-move', options).then(
      res => res.json()
    ).then(
      data => {
        console.log('bruh');
        let newBoard = cloneBoard(board);
        newBoard[i] = 'X';
        setStatus('O move');

        // server will return the computer move if it exists
        setTimeout(() => {
          if (data['move']!==-1) newBoard[data['move']] = 'O';
          setWinner(data['winner']);
          setStatus('X Move');
          console.log('done');
          setBoard(newBoard);
        }, 1000);
        return
      }
    )
  }

  let row = [];
  for (let i=0;i<9;i++) {
    row.push(<Square handleClick={() => handleClick(i)} value={board[i]}/>);
    if (i%3===2) {
      userGrid.push(<div className='squareRow'>
      {row}
      <br/>
    </div>);
      row = [];
    }
  }

  return (
    <>
      <h1> Tic-Tac-Toe </h1> <br/>
      {userGrid}
    </>
  );
}

export default App;
