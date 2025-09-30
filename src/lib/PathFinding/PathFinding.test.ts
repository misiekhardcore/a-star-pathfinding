import { Node, Position } from '@/entities';
import { PathFinding } from './PathFinding';

describe('PathFinding', () => {
  const grid = [
    [new Node(new Position(0, 0)), new Node(new Position(0, 1)), new Node(new Position(0, 2))],
    [new Node(new Position(1, 0)), new Node(new Position(1, 1)), new Node(new Position(1, 2))],
    [new Node(new Position(2, 0)), new Node(new Position(2, 1)), new Node(new Position(2, 2))],
  ];

  describe('getNextStep', () => {
    it('should be able to get the next step', () => {
      const startNode = grid[0][0];
      const endNode = grid[2][2];
      const pathFinding = new PathFinding(grid, startNode, endNode);
      let nextStep = pathFinding.getNextStep();
      expect(nextStep).toHaveLength(1);
      expect(nextStep[0]).toEqual(grid[0][0]);
      nextStep = pathFinding.getNextStep();
      expect(nextStep).toHaveLength(2);
      expect(nextStep[1]).toEqual(grid[1][1]);
      nextStep = pathFinding.getNextStep();
      expect(nextStep).toHaveLength(3);
      expect(nextStep[2]).toEqual(grid[2][2]);
    });
  });

  describe('getLowestFNode', () => {
    it('should be able to get the lowest f node', () => {
      const startNode = grid[0][0];
      const endNode = grid[2][2];
      const pathFinding = new PathFinding(grid, startNode, endNode);
      expect(pathFinding.getLowestFNode()).toEqual(grid[0][0]);
    });
  });

  describe('reconstructPath', () => {
    it('should be able to reconstruct the path', () => {
      const startNode = grid[0][0];
      const endNode = grid[2][2];
      const pathFinding = new PathFinding(grid, startNode, endNode);

      while (!pathFinding.isEndReached(grid)) {
        pathFinding.getNextStep();
      }

      expect(pathFinding.reconstructPath(endNode)).toContainEqual(grid[1][1]);
      expect(pathFinding.reconstructPath(endNode)).toContainEqual(grid[2][2]);
    });
  });

  describe('isEndReached', () => {
    it('should be able to check if the end is reached', () => {
      const startNode = grid[0][0];
      const endNode = grid[2][2];
      const pathFinding = new PathFinding(grid, startNode, endNode);
      expect(pathFinding.isEndReached(grid)).toBe(false);
    });
  });

  describe('isPathNode', () => {
    it('should be able to check if the node is a path node', () => {
      const startNode = grid[0][0];
      const endNode = grid[2][2];
      const pathFinding = new PathFinding(grid, startNode, endNode);
      expect(pathFinding.isPathNode(grid[0][0])).toBe(true);
    });

    it('should be able to check if the node is not a path node', () => {
      const startNode = grid[0][0];
      const endNode = grid[2][2];
      const pathFinding = new PathFinding(grid, startNode, endNode);
      expect(pathFinding.isPathNode(grid[0][1])).toBe(false);
    });
  });
});
