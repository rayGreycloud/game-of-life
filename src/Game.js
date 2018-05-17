import React, { Component }  from 'react';
import Cell from './Cell';
import './Game.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Game extends Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();    
  }
  
  state = {
    cells: [],
    interval: 100,
    isRunning: false,
    generation: 1
  }
  
  makeEmptyBoard() {
    let board = [];
    for (let y = 0; y < this.rows; y++) {
      board[y] = [];
      for (let x = 0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    return board;
  }
  
  // Create cell list from board state
  makeCells() {
    let cells = [];
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (this.board[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    return cells;
  }
  
  // Calculate position of baard element
  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;
    
    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop
    };
  }
  
  // Handle board click 
  handleClick = event => {
  
    // Get click position 
    const elemOffset = this.getElementOffset();
    // Convert to relative position 
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    // Calculate cols/rows of clicked cell 
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);
    if (x >=0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }
    // Revert cell state 
    this.setState({ cells: this.makeCells() });
  }
  
  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  }
  
  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }
  
  runIteration() {
    if (this.emptyBoard(this.board)) {
      this.stopGame();  
    }
    
    let newBoard = this.makeEmptyBoard();
    
    // Implement game rules 
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
        // If occupied 
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!this.board[y[x]] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }    
    
    this.board = newBoard;
    let nextGeneration = this.state.generation + 1;
    this.setState({ 
      cells: this.makeCells(),
      generation: nextGeneration
    });
    
    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.state.interval);    
  }
  
  emptyBoard(board) {
    let empty = true;
    
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        if (board[y][x]) {
          empty = false;
        }
      }
    }
    
    return empty;
  }
  
  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    // Surrounding coordinates relative to x,y
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    
    for (let i = 0; i < dirs.length; i++) {
      const dir = dirs[i];
      let y1 = y + dir[0];
      let x1 = x + dir[1];

      if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
          neighbors++;
      }
    }    
    
    return neighbors;
  }
  
  handleIntervalChange = event => {
    this.setState({ interval: event.target.value });
  }
  
  handleClear = () => {
    this.board = this.makeEmptyBoard();
    this.setState({ 
      cells: this.makeCells(),
      generation: 1
    });
  }
  
  handleRandom = () => {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.board[y][x] = (Math.random() >= 0.7);
      }
    }  
    
    this.setState({ cells: this.makeCells() });  
  }
  
  render() {
    const { cells, isRunning, generation } = this.state;
    
    return (
      <div>
        <h2 className="generation">Generation: {generation}</h2>
        <div 
          className="Board"
          onClick={this.handleClick.bind(this)}
          ref={ n => { this.boardRef = n; }}
          style={{ 
            width: WIDTH, 
            height: HEIGHT,
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` 
          }}
        >
          {cells.map(cell => (
            <Cell 
              x={cell.x} 
              y={cell.y} 
              key={`${cell.x},${cell.y}`} 
              cellSize={CELL_SIZE}
            />
          ))}  
        </div>
        
        <div className="controls">
          Update every <span className="input">
            <input 
              value={this.state.interval}
              onChange={this.handleIntervalChange}
            />            
          </span> msec 
          { isRunning ?
            <button className="button"
              onClick={this.stopGame}>Stop</button> :
            <button className="button"
              onClick={this.runGame}>Run</button> 
          }
          <button 
            className="button"
            onClick={this.handleClear}
            >Clear</button>
          <button 
            className="button"
            onClick={this.handleRandom}
            >Random</button>
        </div>
      </div>
    );
  }
}

export default Game;
