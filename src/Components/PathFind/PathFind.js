import React, { useState, useEffect } from "react";
import Node from "../Node/Node";

import "./PathFind.css";

const cols = 40;
const rows = 18;

const PathFind = () => {
  const [Grid, setGrid] = useState([]);
  const [mouseIsPressed, setMouseIsPressed] = useState(false);
  const [isStartSelected, setIsStartSelected] = useState(false);
  const [isFinishSelected, setIsFinishSelected] = useState(false);
  const [NODE_START_ROW, set_NODE_START_ROW] = useState(0);
  const [NODE_START_COL, set_NODE_START_COL] = useState(0);
  const [NODE_FINISH_ROW, set_NODE_FINISH_ROW] = useState(rows - 1);
  const [NODE_FINISH_COL, set_NODE_FINISH_COL] = useState(cols - 1);

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
    this.isFinish =
      this.row === NODE_FINISH_ROW && this.col === NODE_FINISH_COL;
    this.distance = Infinity;
    this.isVisited = false;
    this.isWall = false;
    this.previousNode = null;
  }

  const handleMouseDown = (row, col) => {
    if (row === NODE_START_ROW && col === NODE_START_COL) {
      setIsStartSelected(true);
    } else if (row === NODE_FINISH_ROW && col === NODE_FINISH_COL) {
      setIsFinishSelected(true);
    } else {
      const newGrid = getNewGridWithWallToggled(Grid, row, col);
      setGrid(newGrid);
    }

    setMouseIsPressed(true);
  };

  const handleMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;
    if (isStartSelected) {
      changeStartNode(Grid, row, col);
    } else if (isFinishSelected) {
      changeFinishNode(Grid, row, col);
    } else {
      const newGrid = getNewGridWithWallToggled(Grid, row, col);
      setGrid(newGrid);
    }
  };

  const handleMouseUp = () => {
    setMouseIsPressed(false);
    setIsStartSelected(false);
    setIsFinishSelected(false);
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
    return newGrid;
  };

  const changeStartNode = (grid, row, col) => {
    if (row === NODE_FINISH_ROW && col === NODE_FINISH_COL) return;
    if (row === NODE_START_ROW && col === NODE_START_COL) return;
    const newGrid = grid.slice();
    const oldStart = newGrid[NODE_START_ROW][NODE_START_COL];
    const resetedOldStart = {
      ...oldStart,
      isWall: false,
      isStart: false,
    };
    newGrid[NODE_START_ROW][NODE_START_COL] = resetedOldStart;
    const newStart = newGrid[row][col];
    const setNewStart = {
      ...newStart,
      isWall: false,
      isStart: true,
    };
    newGrid[row][col] = setNewStart;

    set_NODE_START_ROW(row);
    set_NODE_START_COL(col);

    return newGrid;
  };

  const changeFinishNode = (grid, row, col) => {
    if (row === NODE_FINISH_ROW && col === NODE_FINISH_COL) return;
    if (row === NODE_START_ROW && col === NODE_START_COL) return;
    const newGrid = grid.slice();
    const oldFinish = newGrid[NODE_FINISH_ROW][NODE_FINISH_COL];
    const resetedOldFinish = {
      ...oldFinish,
      isWall: false,
      isFinish: false,
    };
    newGrid[NODE_FINISH_ROW][NODE_FINISH_COL] = resetedOldFinish;
    const newFinish = newGrid[row][col];
    const setNewFinish = {
      ...newFinish,
      isWall: false,
      isFinish: true,
    };
    newGrid[row][col] = setNewFinish;

    set_NODE_FINISH_ROW(row);
    set_NODE_FINISH_COL(col);

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
