import { Position } from '../Position/Position';
import { Node } from './Node';

describe('Node', () => {
  const grid = [
    [
      new Node(new Position(0, 0)),
      new Node(new Position(0, 1), null, false),
      new Node(new Position(0, 2)),
    ],
    [new Node(new Position(1, 0)), new Node(new Position(1, 1)), new Node(new Position(1, 2))],
    [new Node(new Position(2, 0)), new Node(new Position(2, 1)), new Node(new Position(2, 2))],
  ];

  describe('getNeighbors', () => {
    it('should be able to get all 8 neighbors if in the middle of the grid', () => {
      const node = new Node(new Position(1, 1));
      const neighbors = node.getNeighbors(grid);
      expect(neighbors).toHaveLength(8);
    });

    it('should be able to get all 5 neighbors if on the edge of the grid', () => {
      const node = new Node(new Position(0, 1));
      const neighbors = node.getNeighbors(grid);
      expect(neighbors).toHaveLength(5);

      const node2 = new Node(new Position(1, 0));
      const neighbors2 = node2.getNeighbors(grid);
      expect(neighbors2).toHaveLength(5);
    });

    it('should be able to get all 3 neighbors if on the corner of the grid', () => {
      const node = new Node(new Position(0, 0));
      const neighbors = node.getNeighbors(grid);
      expect(neighbors).toHaveLength(3);

      const node2 = new Node(new Position(2, 2));
      const neighbors2 = node2.getNeighbors(grid);
      expect(neighbors2).toHaveLength(3);
    });
  });

  describe('isWalkableFromNode', () => {
    it('should be false if the node is not walkable', () => {
      const node = new Node(new Position(0, 0), null, false);
      expect(node.isWalkableFromNode(grid[0][1], grid)).toBe(false);
    });

    it('should be false if the node is not a neighbor', () => {
      const node = new Node(new Position(0, 0));
      expect(node.isWalkableFromNode(grid[0][2], grid)).toBe(false);
    });

    it('should be false if the node is not walkable from the other node', () => {
      const node = new Node(new Position(0, 0));
      expect(node.isWalkableFromNode(grid[1][1], grid)).toBe(false);
    });

    it('should be true if the node is walkable from the other node', () => {
      const node = new Node(new Position(0, 0));
      expect(node.isWalkableFromNode(grid[0][1], grid)).toBe(true);
    });
  });

  describe('getDistance', () => {
    it('should be able to get the distance between two nodes', () => {
      const node = new Node(new Position(0, 0));
      const node2 = new Node(new Position(0, 1));
      expect(node.getDistance(node2)).toBe(1);

      const node3 = new Node(new Position(0, 0));
      const node4 = new Node(new Position(0, 2));
      expect(node3.getDistance(node4)).toBe(1);
    });
  });

  describe('getRandomNode', () => {
    it('should be able to get a random node', () => {
      const node = Node.getRandomNode(10, 10);
      expect(node).toBeInstanceOf(Node);
    });
  });
});
