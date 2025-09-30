import { Node } from '@/entities';

export class PathFinding {
  private closed: Node[] = [];
  private open: Node[] = [];
  private path: Node[] = [];

  constructor(
    private grid: Node[][],
    private startNode: Node,
    private endNode: Node
  ) {
    this.addNodeToOpen(startNode);
    this.initializeNode(startNode);
  }

  clear() {
    this.closed = [];
    this.open = [this.startNode];
    this.path = [];
  }

  setGrid(grid: Node[][]) {
    this.grid = grid;
    this.clear();
  }

  getGrid(): Node[][] {
    return this.grid;
  }

  getPath(): Node[] {
    return this.path;
  }

  getStartNode(): Node {
    return this.startNode;
  }
  getEndNode(): Node {
    return this.endNode;
  }

  initializeNode(node: Node) {
    const g = node.getDistance(this.endNode);
    const h = this.getHeuristic(this.startNode);
    node.initialize(g, h);
  }

  getNextStep(): Node[] {
    const lowestFNode = this.getLowestFNode();
    if (!lowestFNode) {
      return [];
    }

    this.removeNodeFromOpen(lowestFNode);
    this.addNodeToClosed(lowestFNode);

    if (this.isEnd(lowestFNode)) {
      return this.reconstructPath(lowestFNode);
    }

    const neighbors = this.getWalkableNeighbors(lowestFNode);
    neighbors.forEach((neighbor) => {
      if (this.isInClosed(neighbor)) {
        return;
      }

      const g = neighbor.getDistance(lowestFNode);
      const h = this.getHeuristic(neighbor);
      const f = g + h;
      const isBetter = !this.isInOpen(neighbor) || f < lowestFNode.f;
      if (isBetter && neighbor.isWalkableFromNode(lowestFNode, this.grid)) {
        neighbor.g = g;
        neighbor.h = h;
        neighbor.f = f;
        neighbor.parent = lowestFNode;

        if (!this.isInOpen(neighbor)) {
          this.addNodeToOpen(neighbor);
        }
      }
    });

    return this.reconstructPath(lowestFNode);
  }

  isEndReached(): boolean {
    return this.getLowestFNode() === this.grid[this.grid.length - 1][this.grid[0].length - 1];
  }

  private getHeuristic(node: Node): number {
    return node.position.getDistance(this.endNode.position);
  }

  public getLowestFNode(): Node | undefined {
    return this.sortNodes(this.open)[0];
  }

  private sortNodes(nodes: Node[]): Node[] {
    return nodes.sort((a, b) => a.f - b.f);
  }

  private getWalkableNeighbors(node: Node): Node[] {
    return node
      .getNeighbors(this.grid)
      .filter(
        (neighbor) =>
          neighbor.isWalkableFromNode(node, this.grid) &&
          !this.isStart(neighbor) &&
          !this.isInClosed(neighbor)
      );
  }

  private isInClosed(node: Node): boolean {
    return this.closed.includes(node);
  }

  private isInOpen(node: Node): boolean {
    return this.open.includes(node);
  }

  private addNodeToOpen(node: Node): void {
    this.open.push(node);
  }

  private removeNodeFromOpen(node: Node): void {
    this.open = this.open.filter((n) => n !== node);
  }

  private addNodeToClosed(node: Node): void {
    this.closed.push(node);
  }

  private isEnd(node: Node): boolean {
    return node === this.endNode;
  }

  private isStart(node: Node): boolean {
    return (
      node.position.x === this.startNode.position.x && node.position.y === this.startNode.position.y
    );
  }

  public isPathNode(node: Node): boolean {
    return this.isInOpen(node) || this.isInClosed(node);
  }

  public reconstructPath(node: Node): Node[] {
    const path = [node];
    while (node.parent) {
      node = node.parent;
      path.push(node);
    }
    this.path = path.reverse();
    return this.path;
  }
}
