import React, { useState, useEffect } from "react";
import Node from "../Node/Node";

import "./PathFind.css";

import {
  astar,
  getAstarNodesInShortestPathOrder,
} from "./../../Algorithms/AStar/AStar";
import {
  dijkstra,
  getNodesInShortestPathOrder,
} from "./../../Algorithms/Djikstra/Djikstra";

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
  });

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
    this.fVal = 0;
    this.neighbours = [];
    this.addNeighbours = (grid) => {
      let i = this.row;
      let j = this.col;
      if (i > 0) this.neighbours.push(grid[i - 1][j]);
      if (i < rows - 1) this.neighbours.push(grid[i + 1][j]);
      if (j > 0) this.neighbours.push(grid[i][j - 1]);
      if (j < cols - 1) this.neighbours.push(grid[i][j + 1]);
    };
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
    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    return newGrid;
  };

  const changeStartNode = (grid, row, col) => {
    if (row === NODE_FINISH_ROW && col === NODE_FINISH_COL) return;
    if (row === NODE_START_ROW && col === NODE_START_COL) return;
    const newGrid = grid.slice();
    newGrid[NODE_START_ROW][NODE_START_COL].isStart = false;
    newGrid[NODE_START_ROW][NODE_START_COL].isWall = false;
    newGrid[row][col].isWall = false;
    newGrid[row][col].isStart = true;

    set_NODE_START_ROW(row);
    set_NODE_START_COL(col);

    return newGrid;
  };

  const changeFinishNode = (grid, row, col) => {
    if (row === NODE_FINISH_ROW && col === NODE_FINISH_COL) return;
    if (row === NODE_START_ROW && col === NODE_START_COL) return;
    const newGrid = grid.slice();
    newGrid[NODE_FINISH_ROW][NODE_FINISH_COL].isWall = false;
    newGrid[NODE_FINISH_ROW][NODE_FINISH_COL].isFinish = false;
    newGrid[row][col].isWall = false;
    newGrid[row][col].isFinish = true;

    set_NODE_FINISH_ROW(row);
    set_NODE_FINISH_COL(col);

    return newGrid;
  };

  const animateVisitedNodes = (
    visitedNodesInOrder,
    nodesInShortestPathOrder
  ) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-visited";
      }, 10 * i);
    }
  };

  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path";
      }, 50 * i);
    }
  };

  const visualizeDijkstra = () => {
    clearPath();
    const startNode = Grid[NODE_START_ROW][NODE_START_COL];
    const finishNode = Grid[NODE_FINISH_ROW][NODE_FINISH_COL];
    const visitedNodesInOrder = dijkstra(Grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const visualizeAstar = () => {
    clearPath();
    const startNode = Grid[NODE_START_ROW][NODE_START_COL];
    const finishNode = Grid[NODE_FINISH_ROW][NODE_FINISH_COL];
    const visitedNodesInOrder = astar(Grid, startNode, finishNode);
    const nodesInShortestPathOrder =
      getAstarNodesInShortestPathOrder(finishNode);
    animateVisitedNodes(visitedNodesInOrder, nodesInShortestPathOrder);
  };

  const clearPath = () => {
    const newGrid = Grid.slice();
    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        document
          .getElementById(`node-${i}-${j}`)
          .classList.remove("node-shortest-path", "node-visited");

        if (i === NODE_START_ROW && j === NODE_START_COL) {
          document.getElementById(`node-${i}-${j}`).classList.add("start-node");
        }
        if (i === NODE_FINISH_ROW && j === NODE_FINISH_COL) {
          document.getElementById(`node-${i}-${j}`).classList.add("end-node");
        }

        newGrid[i][j].isVisited = false;
        newGrid[i][j].previousNode = null;
        newGrid[i][j].neighbours = [];
        newGrid[i][j].distance = Infinity;
      }
    }
    setGrid(newGrid);
  };

  const clearBoard = () => {
    clearPath();
    initializeGrid();
  };

  return (
    <div className="wrapper">
      <h1>Path Finding Algorithm Visualizer</h1>
      <div style={{ display: "flex" }}>
        <button
          style={{ marginBottom: "20px" }}
          onClick={() => visualizeDijkstra()}
        >
          Visualize Dijkstra's Algorithm
        </button>
        <button
          style={{ marginBottom: "20px" }}
          onClick={() => visualizeAstar()}
        >
          Visualize AStar Algorithm
        </button>
        <button style={{ marginBottom: "20px" }} onClick={() => clearPath()}>
          Clear Path
        </button>
        <button style={{ marginBottom: "20px" }} onClick={() => clearBoard()}>
          Clear Board
        </button>
      </div>

      {gridWithNode}
    </div>
  );
};

export default PathFind;
