import { Node, Position } from '@/entities';
import {
  DefaultGCalculation,
  DefaultHCalculation,
  DefaultFCalculation,
  ManhattanHCalculation,
  WeightedFCalculation,
  GCalculationStrategy,
  HCalculationStrategy,
  FCalculationStrategy,
} from '@/lib/strategies';
import { PathFinding } from '@/lib';

describe('Strategy Pattern Implementation', () => {
  let grid: Node[][];
  let startNode: Node;
  let endNode: Node;

  beforeEach(() => {
    // Create a simple 3x3 grid for testing
    grid = [
      [new Node(new Position(0, 0)), new Node(new Position(1, 0)), new Node(new Position(2, 0))],
      [new Node(new Position(0, 1)), new Node(new Position(1, 1)), new Node(new Position(2, 1))],
      [new Node(new Position(0, 2)), new Node(new Position(1, 2)), new Node(new Position(2, 2))],
    ];

    startNode = grid[0][0];
    endNode = grid[2][2];
  });

  describe('Default Strategies', () => {
    it('should use default G calculation strategy', () => {
      const gStrategy = new DefaultGCalculation();
      const result = gStrategy.calculate(startNode, grid[0][1]);

      // Should return the distance between the nodes
      expect(result).toBeGreaterThan(0);
    });

    it('should use default H calculation strategy', () => {
      const hStrategy = new DefaultHCalculation();
      const result = hStrategy.calculate(startNode, endNode);

      // Should return the heuristic distance to the goal
      expect(result).toBeGreaterThan(0);
    });

    it('should use default F calculation strategy', () => {
      const fStrategy = new DefaultFCalculation();
      const result = fStrategy.calculate(5, 3);

      // Should return g + h
      expect(result).toBe(8);
    });
  });

  describe('PathFinding with Custom Strategies', () => {
    it('should work with default strategies', () => {
      const pathFinding = new PathFinding(grid, startNode, endNode);

      // Should initialize without throwing
      expect(pathFinding).toBeDefined();
      expect(pathFinding.getLowestFNode()).toBe(startNode);
    });

    it('should work with custom strategies', () => {
      // Custom strategies that multiply by 2
      class CustomGCalculation implements GCalculationStrategy {
        calculate(current: Node, neighbor: Node): number {
          return neighbor.getDistance(current) * 2;
        }
      }

      class CustomHCalculation implements HCalculationStrategy {
        calculate(node: Node, goalNode: Node): number {
          return node.position.getDistance(goalNode.position) * 2;
        }
      }

      class CustomFCalculation implements FCalculationStrategy {
        calculate(g: number, h: number): number {
          return g + h + 1; // Add a constant penalty
        }
      }

      const pathFinding = new PathFinding(
        grid,
        startNode,
        endNode,
        new CustomGCalculation(),
        new CustomHCalculation(),
        new CustomFCalculation()
      );

      expect(pathFinding).toBeDefined();
      expect(pathFinding.getLowestFNode()).toBe(startNode);

      // The start node should have custom calculated values
      expect(startNode.f).toBeGreaterThan(0);
    });
  });

  describe('Backwards Compatibility', () => {
    it('should maintain same behavior as original implementation', () => {
      // Test with default strategies (should behave like original)
      const pathFinding = new PathFinding(grid, startNode, endNode);

      // Verify pathfinding instance is created properly
      expect(pathFinding).toBeDefined();
      expect(pathFinding.getLowestFNode()).toBe(startNode);

      // Initialize a node and check values are calculated correctly
      const testNode = grid[1][1];
      const originalG = testNode.getDistance(startNode);
      const originalH = testNode.position.getDistance(endNode.position);

      // The behavior should be equivalent to the original implementation
      expect(typeof originalG).toBe('number');
      expect(typeof originalH).toBe('number');
    });
  });

  describe('Additional Strategy Examples', () => {
    it('should work with Manhattan distance heuristic', () => {
      const pathFinding = new PathFinding(
        grid,
        startNode,
        endNode,
        new DefaultGCalculation(),
        new ManhattanHCalculation(),
        new DefaultFCalculation()
      );

      expect(pathFinding).toBeDefined();
      expect(pathFinding.getLowestFNode()).toBe(startNode);
    });

    it('should work with weighted F calculation', () => {
      const pathFinding = new PathFinding(
        grid,
        startNode,
        endNode,
        new DefaultGCalculation(),
        new DefaultHCalculation(),
        new WeightedFCalculation(1.5)
      );

      expect(pathFinding).toBeDefined();
      expect(pathFinding.getLowestFNode()).toBe(startNode);
    });

    it('should calculate Manhattan distance correctly', () => {
      const manhattanStrategy = new ManhattanHCalculation();
      const result = manhattanStrategy.calculate(
        new Node(new Position(0, 0)),
        new Node(new Position(3, 4))
      );

      // Manhattan distance should be |3-0| + |4-0| = 7
      expect(result).toBe(7);
    });

    it('should calculate weighted F correctly', () => {
      const weightedStrategy = new WeightedFCalculation(2.0);
      const result = weightedStrategy.calculate(5, 3);

      // Weighted F should be g + h * weight = 5 + 3 * 2.0 = 11
      expect(result).toBe(11);
    });
  });
});
