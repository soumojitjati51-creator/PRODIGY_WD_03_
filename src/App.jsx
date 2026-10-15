import { useEffect, useMemo, useState } from 'react'
import './App.css'

const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function calculateWinner(squares) {
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function findBestMove(squares, aiMarker, userMarker) {
  const openPositions = squares
    .map((value, index) => (value ? null : index))
    .filter((value) => value !== null)

  for (const index of openPositions) {
    const candidate = [...squares]
    candidate[index] = aiMarker
    if (calculateWinner(candidate) === aiMarker) {
      return index
    }
  }

  for (const index of openPositions) {
    const candidate = [...squares]
    candidate[index] = userMarker
    if (calculateWinner(candidate) === userMarker) {
      return index
    }
  }

  if (openPositions.includes(4)) {
    return 4
  }

  return openPositions[Math.floor(Math.random() * openPositions.length)]
}

function App() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [playAgainstAI, setPlayAgainstAI] = useState(false)

  const winner = useMemo(() => calculateWinner(squares), [squares])
  const isDraw = useMemo(
    () => !winner && squares.every((square) => square !== null),
    [squares, winner],
  )

  useEffect(() => {
    if (!playAgainstAI || xIsNext || winner || isDraw) {
      return
    }

    const move = findBestMove(squares, 'O', 'X')
    if (move === undefined) {
      return
    }

    const timer = setTimeout(() => {
      setSquares((currentSquares) => {
        if (currentSquares[move] || calculateWinner(currentSquares)) {
          return currentSquares
        }
        const nextSquares = [...currentSquares]
        nextSquares[move] = 'O'
        return nextSquares
      })
      setXIsNext(true)
    }, 350)

    return () => clearTimeout(timer)
  }, [isDraw, playAgainstAI, squares, winner, xIsNext])

  const handleClick = (index) => {
    if (squares[index] || winner || (!xIsNext && playAgainstAI)) {
      return
    }

    const nextSquares = [...squares]
    nextSquares[index] = xIsNext ? 'X' : 'O'
    setSquares(nextSquares)
    setXIsNext(!xIsNext)
  }

  const resetGame = () => {
    setSquares(Array(9).fill(null))
    setXIsNext(true)
  }

  let status = `Current player: ${xIsNext ? 'X' : 'O'}`
  if (winner) {
    status = `Winner: ${winner}`
  } else if (isDraw) {
    status = "It's a draw!"
  }

  return (
    <main className="app">
      <h1>Tic-Tac-Toe</h1>
      <p className="status" aria-live="polite">
        {status}
      </p>

      <div className="controls">
        <label>
          <input
            type="checkbox"
            checked={playAgainstAI}
            onChange={(event) => {
              setPlayAgainstAI(event.target.checked)
              resetGame()
            }}
          />
          Play against AI
        </label>
        <button type="button" onClick={resetGame}>
          Restart
        </button>
      </div>

      <div className="board" role="grid" aria-label="Tic-tac-toe board">
        {squares.map((value, index) => (
          <button
            key={index}
            type="button"
            className="cell"
            onClick={() => handleClick(index)}
            role="gridcell"
            aria-label={`Cell ${index + 1}${value ? `, ${value}` : ''}`}
          >
            {value}
          </button>
        ))}
      </div>
    </main>
  )
}

export default App
