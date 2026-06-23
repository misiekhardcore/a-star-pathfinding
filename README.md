# A\* Pathfinding Visualizer

An interactive visualization of the A\* pathfinding algorithm built with Next.js, TypeScript, and React. Watch as the algorithm finds the optimal path from start to end while avoiding obstacles in real-time.

![A* Pathfinding Visualizer](https://img.shields.io/badge/Next.js-15.5.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)

## Features

- 🎯 **Interactive A\* Algorithm**: Step-by-step visualization of the A\* pathfinding algorithm
- 🎮 **Real-time Controls**: Run auto, step through manually, or reset the grid
- 🎨 **Visual Feedback**: Color-coded nodes showing different states (start, end, path, obstacles)
- 🧩 **Dynamic Grid**: Randomly generated obstacles for varied pathfinding challenges
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast Performance**: Optimized with Next.js 15 and React 19

## How It Works

The A\* algorithm combines:

- **G-cost**: Distance from start node
- **H-cost**: Heuristic distance to end node (Manhattan distance)
- **F-cost**: G + H (total estimated cost)

The algorithm explores nodes with the lowest F-cost first, ensuring it finds the optimal path while being more efficient than Dijkstra's algorithm.

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 4.x

### Installation

1. Clone the repository:

```bash
git clone https://github.com/misiekhardcore/a-star-pathfinding.git
cd a-star-pathfinding
```

2. Install dependencies:

```bash
yarn install
```

3. Run the development server:

```bash
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

- **Run Auto**: Automatically steps through the algorithm at 100ms intervals
- **Next Step**: Manually advance one step of the algorithm
- **Reset**: Generate a new random grid and restart the algorithm

### Color Legend

- 🟢 **Green**: Start node
- 🔴 **Red**: End node
- 🟣 **Purple**: Current path being explored
- 🟡 **Yellow**: Final optimal path (when algorithm completes)
- 🔵 **Navy**: Obstacles/walls
- ⚪ **Black**: Unexplored walkable nodes
