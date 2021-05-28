import React from "react";
import "./Node.css";

const Node = (props) => {
  const {
    row,
    col,
    isFinish,
    isStart,
    isWall,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
  } = props;
  const classes = isStart
    ? "start-node"
    : isFinish
    ? "end-node"
    : isWall
    ? "wall-node"
    : "";
  return (
    <div
      className={`node ${classes}`}
      id={`node-${row}-${col}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp()}
    ></div>
  );
};

export default Node;
