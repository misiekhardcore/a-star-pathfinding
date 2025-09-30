import { Node } from '@/entities';
import {
  GCalculationStrategy,
  HCalculationStrategy,
  FCalculationStrategy,
  DefaultGCalculation,
  DefaultHCalculation,
  DefaultFCalculation,
} from '../strategies';

export class PathFinding {
  private closed: Node[] = [];
  private open: Node[] = [];

  constructor(
    private grid: Node[][],
    private startNode: Node,
    private endNode: Node,
    private gStrategy: GCalculationStrategy = new DefaultGCalculation(),
    private hStrategy: HCalculationStrategy = new DefaultHCalculation(),
    private fStrategy: FCalculationStrategy = new DefaultFCalculation()
  ) {
    this.addNodeToOpen(startNode);
    this.initializeNode(startNode);
  }

  clear() {
    this.closed = [];
    this.open = [this.startNode];
  }

  setGrid(grid: Node[][]) {
    this.grid = grid;
    this.clear();
  }

  initializeNode(node: Node) {
    const g = this.gStrategy.calculate(node, this.endNode);
    const h = this.hStrategy.calculate(this.startNode, this.endNode);
    const f = this.fStrategy.calculate(g, h);
    node.initialize(g, h, f);
  }

  getNextStep(): Node[] {
    const lowestFNode = this.getLowestFNode();
    if (!lowestFNode) {
      return [];
    }

    this.removeNodeFromOpen(lowestFNode);
    this.addNodeToClosed(lowestFNode);

    if (this.isEnd(lowestFNode)) {
      this.open = [this.endNode];
      return this.reconstructPath(lowestFNode);
    }

    const neighbors = this.getWalkableNeighbors(lowestFNode);
    neighbors.forEach((neighbor) => {
      if (this.isInClosed(neighbor)) {
        return;
      }

      const g = this.gStrategy.calculate(lowestFNode, neighbor);
      const h = this.hStrategy.calculate(neighbor, this.endNode);
      const f = this.fStrategy.calculate(g, h);
      const isBetter = !this.isInOpen(neighbor) || f < lowestFNode.f;
      if (isBetter && neighbor.isWalkableFromNode(lowestFNode, this.grid)) {
        neighbor.initialize(g, h, f);
        neighbor.parent = lowestFNode;

        if (!this.isInOpen(neighbor)) {
          this.addNodeToOpen(neighbor);
        }
      }
    });

    return this.reconstructPath(lowestFNode);
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
      path.push(node);
      node = node.parent;
    }
    return path.reverse();
  }
}
