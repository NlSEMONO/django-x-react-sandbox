import {useState, useEffect} from 'react';
import './App.css';

function Square({handleClick, value}) {
  return <button className='square' onClick={handleClick}> {value} </button>
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [status, setStatus] = useState('X Turn');
  const [winner, setWinner] = useState('');
  const [stats, setStats] = useState(Array(2).fill(0));
  const [gameId, setGameId] = useState(0);
  const [showEndOptions, setShowEndOptions] = useState(false);
  const gameDoneElements = [];
  const userGrid = [];

  function cloneBoard(givenBoard) {
    let newBoard = [];
    for (let i=0;i<9;i++) newBoard.push(givenBoard[i]);
    return newBoard;
  }
  
  useEffect(() => {
    if (winner == '' && !board[0]) return;
    setShowEndOptions(true);
  }, [stats])

  useEffect(() => {
    if (winner == '' && !board[0]) return;
    fetch('get-stats', {
      method: 'POST', 
      body: JSON.stringify({
        'winner': winner
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      (res) => res.json()
    ).then(
      (data) => {
        setStats([data['X'], data['O']]);
      }
    );
  }, [winner]);

  function handleClick(i) {
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
        setBoard(newBoard);
        setStatus('O move');
        if (data['winner']==='X') {
          setStatus('X Wins!'); 
          setWinner('X');
          return;
        }

        // server will return the computer move if it exists
        setTimeout(() => {
          if (data['move']===-2) {
            setStatus("Tie Game!");
            return;
          }
          if (data['move']>-1) newBoard[data['move']] = 'O';
          setWinner(data['winner']);
          setStatus('X Move');
          setBoard(newBoard);
          if (data['winner']==='O') setStatus('O Wins!'); 
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

  gameDoneElements.push(<><button className={showEndOptions ? '' : 'invis'} onClick={() => {
    setWinner('');
    setStatus('X Turn');
    setBoard(Array(9).fill(''));
    setShowEndOptions(false);
    fetch('new-game');
  }}> Play again </button> <br/> </>);
  gameDoneElements.push(<div className={showEndOptions ? '' : 'invis'}>
    <h1> {`X Lifetime wins ${stats[0]}`}</h1>
    <h1> {`O Lifetime wins ${stats[1]}`}</h1>
  </div>);

  return (
    <>
      <h1> {status} </h1> <br/>
      <div id='game'> 
        {userGrid}
      </div>
      {gameDoneElements}
    </>
  );
}

export default App;
