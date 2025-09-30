import { Position } from '@/entities';

export class Node {
  public f = 0;
  public g = 0;
  public h = 0;

  constructor(
    public position: Position,
    public parent: Node | null = null,
    private walkable = true
  ) {}

  static getRandomNode(maxX: number, maxY: number): Node {
    return new Node(Position.getRandomPosition(maxX, maxY));
  }

  initialize(g: number, h: number): void {
    this.g = g;
    this.h = h;
    this.f = g + h;
  }

  getDistance(node: Node): number {
    const distnace =
      Math.abs(this.position.x - node.position.x) + Math.abs(this.position.y - node.position.y);
    return distnace === 2 ? 1 : distnace;
  }

  getNeighbors(grid: Node[][]): Node[] {
    const neighbors = [];
    const { x, y } = this.position;

    if (grid[y - 1] && grid[y - 1][x]) {
      neighbors.push(grid[y - 1][x]);
    }

    if (grid[y + 1] && grid[y + 1][x]) {
      neighbors.push(grid[y + 1][x]);
    }

    if (grid[y][x - 1]) {
      neighbors.push(grid[y][x - 1]);
    }

    if (grid[y][x + 1]) {
      neighbors.push(grid[y][x + 1]);
    }

    if (grid[y - 1] && grid[y - 1][x - 1]) {
      neighbors.push(grid[y - 1][x - 1]);
    }

    if (grid[y + 1] && grid[y + 1][x + 1]) {
      neighbors.push(grid[y + 1][x + 1]);
    }

    if (grid[y - 1] && grid[y - 1][x + 1]) {
      neighbors.push(grid[y - 1][x + 1]);
    }

    if (grid[y + 1] && grid[y + 1][x - 1]) {
      neighbors.push(grid[y + 1][x - 1]);
    }

    return neighbors;
  }

  isWalkable(): boolean {
    return this.walkable;
  }

  isWalkableFromNode(node: Node, grid: Node[][]): boolean {
    const neighbors = this.getNeighbors(grid);
    if (node === this) {
      return false;
    }
    if (!neighbors.includes(node)) {
      return false;
    }
    const dX = Math.abs(this.position.x - node.position.x);
    const dY = Math.abs(this.position.y - node.position.y);
    if (dX === 1 && dY === 1) {
      return (
        grid[this.position.y][node.position.x].isWalkable() &&
        grid[node.position.y][this.position.x].isWalkable() &&
        this.isWalkable()
      );
    }
    return this.isWalkable();
  }
}
