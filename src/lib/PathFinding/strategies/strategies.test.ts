import { Node, Position } from '@/entities';
import {
  DefaultFCalculation,
  DefaultGCalculation,
  DefaultHCalculation,
  ManhattanHCalculation,
  WeightedFCalculation,
} from './index';

describe('GCalculation strategies', () => {
  describe('DefaultGCalculation', () => {
    it('returns Node.getDistance() between two nodes', () => {
      const strategy = new DefaultGCalculation();
      const nodeA = new Node(new Position(0, 0));
      const nodeB = new Node(new Position(0, 1));
      expect(strategy.calculate(nodeA, nodeB)).toBe(1);
    });

    it('is symmetric', () => {
      const strategy = new DefaultGCalculation();
      const nodeA = new Node(new Position(0, 0));
      const nodeB = new Node(new Position(1, 2));
      expect(strategy.calculate(nodeA, nodeB)).toBe(strategy.calculate(nodeB, nodeA));
    });

    it('treats diagonal distance (dx=1, dy=1) as 1', () => {
      const strategy = new DefaultGCalculation();
      const nodeA = new Node(new Position(0, 0));
      const nodeB = new Node(new Position(1, 1));
      // Node.getDistance returns 1 for distance=2 (diagonal compression)
      expect(strategy.calculate(nodeA, nodeB)).toBe(1);
    });
  });
});

describe('HCalculation strategies', () => {
  describe('DefaultHCalculation', () => {
    it('returns Position.getDistance() (squared Euclidean)', () => {
      const strategy = new DefaultHCalculation();
      const node = new Node(new Position(0, 0));
      const goal = new Node(new Position(3, 4));
      // Euclidean squared: 3^2 + 4^2 = 9 + 16 = 25
      expect(strategy.calculate(node, goal)).toBe(25);
    });

    it('returns 0 for same node', () => {
      const strategy = new DefaultHCalculation();
      const node = new Node(new Position(3, 4));
      expect(strategy.calculate(node, node)).toBe(0);
    });
  });

  describe('ManhattanHCalculation', () => {
    it('returns |dx| + |dy|', () => {
      const strategy = new ManhattanHCalculation();
      const node = new Node(new Position(0, 0));
      const goal = new Node(new Position(3, 4));
      expect(strategy.calculate(node, goal)).toBe(7);
    });

    it('returns 0 for same node', () => {
      const strategy = new ManhattanHCalculation();
      const node = new Node(new Position(3, 4));
      expect(strategy.calculate(node, node)).toBe(0);
    });

    it('handles negative differences', () => {
      const strategy = new ManhattanHCalculation();
      const node = new Node(new Position(5, 5));
      const goal = new Node(new Position(1, 2));
      expect(strategy.calculate(node, goal)).toBe(7);
    });
  });
});

describe('FCalculation strategies', () => {
  describe('DefaultFCalculation', () => {
    it('returns g + h', () => {
      const strategy = new DefaultFCalculation();
      expect(strategy.calculate(10, 5)).toBe(15);
      expect(strategy.calculate(0, 0)).toBe(0);
    });
  });

  describe('WeightedFCalculation', () => {
    it('returns g + weight * h with default weight 1', () => {
      const strategy = new WeightedFCalculation();
      expect(strategy.calculate(10, 5)).toBe(15);
    });

    it('returns g + weight * h with custom weight', () => {
      const strategy = new WeightedFCalculation(1.5);
      expect(strategy.calculate(10, 5)).toBe(17.5);
    });

    it('returns g + weight * h with weight < 1', () => {
      const strategy = new WeightedFCalculation(0.5);
      expect(strategy.calculate(10, 5)).toBe(12.5);
    });

    it('returns g only when weight is 0', () => {
      const strategy = new WeightedFCalculation(0);
      expect(strategy.calculate(10, 5)).toBe(10);
    });
  });
});

describe('Strategy integration with PathFinding', () => {
  it('uses custom H strategy (Manhattan) and finds a path', () => {
    const grid = [
      [new Node(new Position(0, 0)), new Node(new Position(0, 1)), new Node(new Position(0, 2))],
      [new Node(new Position(1, 0)), new Node(new Position(1, 1)), new Node(new Position(1, 2))],
      [new Node(new Position(2, 0)), new Node(new Position(2, 1)), new Node(new Position(2, 2))],
    ];
    const { PathFinding } = jest.requireActual('../PathFinding');
    const startNode = grid[0][0];
    const endNode = grid[2][2];
    const pf = new PathFinding(
      grid,
      startNode,
      endNode,
      new DefaultGCalculation(),
      new ManhattanHCalculation(),
      new DefaultFCalculation()
    );

    while (!pf.isEndReached()) {
      pf.getNextStep();
    }
    // Process the end node to build the full path
    pf.getNextStep();

    const path = pf.getPath();
    expect(path.length).toBeGreaterThanOrEqual(3);
    expect(path[0]).toEqual(startNode);
    expect(path[path.length - 1]).toEqual(endNode);
  });

  it('uses custom F strategy (weighted) and finds a path', () => {
    const grid = [
      [new Node(new Position(0, 0)), new Node(new Position(0, 1)), new Node(new Position(0, 2))],
      [new Node(new Position(1, 0)), new Node(new Position(1, 1)), new Node(new Position(1, 2))],
      [new Node(new Position(2, 0)), new Node(new Position(2, 1)), new Node(new Position(2, 2))],
    ];
    const { PathFinding } = jest.requireActual('../PathFinding');
    const startNode = grid[0][0];
    const endNode = grid[2][2];
    const pf = new PathFinding(
      grid,
      startNode,
      endNode,
      new DefaultGCalculation(),
      new DefaultHCalculation(),
      new WeightedFCalculation(1.5)
    );

    while (!pf.isEndReached()) {
      pf.getNextStep();
    }
    // Process the end node to build the full path
    pf.getNextStep();

    const path = pf.getPath();
    expect(path.length).toBeGreaterThanOrEqual(3);
    expect(path[0]).toEqual(startNode);
    expect(path[path.length - 1]).toEqual(endNode);
  });

  it('backward compatible: no strategies = original behavior', () => {
    const grid = [
      [new Node(new Position(0, 0)), new Node(new Position(0, 1)), new Node(new Position(0, 2))],
      [new Node(new Position(1, 0)), new Node(new Position(1, 1)), new Node(new Position(1, 2))],
      [new Node(new Position(2, 0)), new Node(new Position(2, 1)), new Node(new Position(2, 2))],
    ];
    const { PathFinding } = jest.requireActual('../PathFinding');
    const startNode = grid[0][0];
    const endNode = grid[2][2];

    // Old-style constructor (no strategies)
    const pf = new PathFinding(grid, startNode, endNode);

    while (!pf.isEndReached()) {
      pf.getNextStep();
    }
    // Process the end node to build the full path
    pf.getNextStep();

    const path = pf.getPath();
    expect(path.length).toBeGreaterThanOrEqual(3);
    expect(path[0]).toEqual(startNode);
    expect(path[path.length - 1]).toEqual(endNode);
  });
});
