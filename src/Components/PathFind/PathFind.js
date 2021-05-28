import React, { useState, useEffect } from "react";
import Node from "../Node/Node";

import "./PathFind.css";

const cols = 40;
const rows = 18;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;

const NODE_END_ROW = rows - 1;
const NODE_END_COL = cols - 1;

const PathFind = () => {
  const [Grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

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
    this.row = i;
    this.col = j;
    this.isStart = this.row === NODE_START_ROW && this.col === NODE_START_COL;
    this.isFinish = this.row === NODE_END_ROW && this.col === NODE_END_COL;
    this.distance = Infinity;
    this.isVisited = false;
    this.isWall = false;
    this.previousNode = null;
  }

  const handleMouseDown = (row, col) => {
    const newGrid = getNewGridWithWallToggled(Grid, row, col);
    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(Grid, row, col);
    setGrid(newGrid);
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
  };

  const gridWithNode = (
    <div>
      {Grid.map((row, rowIdx) => (
        <div key={rowIdx} className="rowWrapper">
          {row.map((col, colIdx) => {
            const { isStart, isFinish, isWall } = col;
            return (
              <Node
                key={colIdx}
                isStart={isStart}
                isFinish={isFinish}
                isWall={isWall}
                row={rowIdx}
                col={colIdx}
                mouseIsPressed={mouseIsPressed}
                onMouseDown={(row, col) => handleMouseDown(row, col)}
                onMouseEnter={(row, col) => handleMouseEnter(row, col)}
                onMouseUp={() => handleMouseUp()}
              />
            );
          })}
        </div>
      ))}
    </div>
  );

  const getNewGridWithWallToggled = (grid, row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];
    const newNode = {
      ...node,
      isWall: !node.isWall,
    };
    newGrid[row][col] = newNode;
    console.log(newGrid);
    return newGrid;
  };

  return (
    <div className="wrapper">
      <h1>Path Finding Algorithm Visualizer</h1>
      {gridWithNode}
    </div>
  );
};

export default PathFind;
