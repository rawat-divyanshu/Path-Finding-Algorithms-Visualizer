export const astar = (grid, startNode, finishNode) => {
  addNeighbours(grid);
  const nextToVisit = [];
  const visitedNodesInOrder = [];
  nextToVisit.push(startNode);

  while (nextToVisit.length > 0) {
    sortNodesByFscore(nextToVisit);
    const currentNode = nextToVisit.shift();

    if (currentNode.isWall) continue;

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    const neighbours = currentNode.neighbours;

    for (let i = 0; i < neighbours.length; i++) {
      let neighbour = neighbours[i];
      if (!visitedNodesInOrder.includes(neighbour)) {
        neighbour.fVal = heuristic(neighbour, finishNode);
        neighbour.previousNode = currentNode;
        nextToVisit.push(neighbour);
      }
    }
  }
  return visitedNodesInOrder;
};

const sortNodesByFscore = (nextToVisit) => {
  nextToVisit.sort((nodeA, nodeB) => nodeA.fVal - nodeB.fVal);
};

const heuristic = (nodeA, nodeB) => {
  const x1 = nodeA.row;
  const y1 = nodeA.col;
  const x2 = nodeB.row;
  const y2 = nodeB.col;

  const d = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
  return d;
};

export function getAstarNodesInShortestPathOrder(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}

const addNeighbours = (grid) => {
  for (const row of grid) {
    for (const node of row) {
      node.addNeighbours(grid);
    }
  }
};
