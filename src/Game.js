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
    cells: []
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
  console.log(elemOffset);
    // Convert to relative position 
    const offsetX = event.clientX - elemOffset.x;
  
    const offsetY = event.clientY - elemOffset.y;
  console.log(offsetX, offsetY);
    // Calculate cols/rows of clicked cell 
    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);
  console.log(x,y);  
    if (x >=0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }
    // Revert cell state 
    this.setState({ cells: this.makeCells() });
  }
  
  render() {
    const { cells } = this.state;
    
    return (
      <div>
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
      </div>
    );
  }
}

export default Game;
