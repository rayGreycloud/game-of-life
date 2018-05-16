import React, { Component } from 'react';

class Cell extends Component {
  
  
  render() {
    const { x, y, cellSize } = this.props;
    
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);   
     
    return (
      <div
        className="Cell"
        style={{
          left: `${cellSize * x + 1}px`,
          top: `${cellSize * y + 1}px`,
          width: `${cellSize - 1}px`,
          height: `${cellSize - 1}px`,
          background: `rgb(${r}, ${g}, ${b})`
        }}  
      />
    );
  }
}

export default Cell;
