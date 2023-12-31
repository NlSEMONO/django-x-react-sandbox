import {useState, useEffect} from 'react';
import './App.css';

function Square({handleClick, value}) {
  return <button className='square' onClick={handleClick}> {value} </button>
}

function App() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const playerName = localStorage.getItem('username') === 'Guest' ? 'X' : localStorage.getItem('username');
  const [status, setStatus] = useState(`${playerName} Turn`);
  const [winner, setWinner] = useState('');
  const [stats, setStats] = useState(Array(2).fill(0));
  const [gameId, setGameId] = useState(-1);
  const [showEndOptions, setShowEndOptions] = useState(false);
  const gameDoneElements = [];
  const userGrid = [];

  useEffect(() => {
    if (playerName==='' || playerName === null) window.location.href='login';
  }, [])

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
        'winner': winner === 'NONE' ? '' : winner,
        'p1': playerName,
      }),
      headers: {
        'content-type': 'application/json'
      }
    }).then(
      (res) => res.json()
    ).then(
      (data) => {
        setStats([data[playerName], data['O']]);
      }
    );
  }, [winner]);

  function handleClick(i) {
    // block invalid inputs
    if (winner !== '' || board[i] || status === 'O Turn') {
      return;
    }
    // if valid input, make the request to DB
    const options = {
      method: "POST", 
      body: JSON.stringify({
        'move': i, 
        'id': gameId
      }), 
      headers: {
        'content-type': 'application/json'
      },
      keepalive: false,
    };
    fetch('player-move', options).then(
      res => res.json()
    ).then(
      data => {
        if (gameId === -1) setGameId(data['id']); 
        let newBoard = cloneBoard(board);
        newBoard[i] = 'X';
        setBoard(newBoard);
        setStatus('O Turn');
        if (data['winner']==='X') {
          setStatus(`${playerName} Wins!`); 
          setWinner(`${playerName}`);
          return;
        }

        // server will return the computer move if it exists
        setTimeout(() => {
          if (data['move']===-2) {
            setStatus("Tie Game!");
            setWinner('NONE');
            return;
          }
          if (data['move']>-1) newBoard[data['move']] = 'O';
          setWinner(data['winner']);
          setStatus(`${playerName} Turn`);
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
    fetch('new-game', {
      method: "POST",
      body: JSON.stringify({
        'id': gameId
      })
    });
  }}> Play again </button> <br/> </>);
  gameDoneElements.push(<div className={showEndOptions ? '' : 'invis'}>
    <h1> {`${playerName} Lifetime wins: ${stats[0]}`}</h1>
    <h1> {`O Lifetime wins: ${stats[1]}`}</h1>
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
