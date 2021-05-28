import React, { useState, useEffect } from "react";
import Node from "../Node/Node";

import "./PathFind.css";

const cols = 40;
const rows = 18;

const NODE_START_ROW = 0;
const NODE_START_COl = 0;

const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;

const PathFind = () => {
  const [Grid, setGrid] = useState([]);

  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
      grid[i] = new Array(cols);
    }

    createSpot(grid);

    setGrid(grid);
  };

  const createSpot = (grid) => {
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        grid[i][j] = new Spot(i, j);
      }
    }
  };

  // Spot Constructor
  function Spot(i, j) {
    this.x = i;
    this.y = j;
    this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COl;
    this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
    this.g = 0;
    this.f = 0;
    this.h = 0;
  }

  const gridWithNode = (
    <div>
      {Grid.map((row, rowIdx) => (
        <div key={rowIdx} className="rowWrapper">
          {row.map((col, colIdx) => {
            const { isStart, isEnd } = col;
            return (
              <Node
                key={colIdx}
                isStart={isStart}
                isEnd={isEnd}
                row={rowIdx}
                col={colIdx}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <div className="wrapper">
      <h1>Path Find Component</h1>
      {gridWithNode}
    </div>
  );
};

export default PathFind;
