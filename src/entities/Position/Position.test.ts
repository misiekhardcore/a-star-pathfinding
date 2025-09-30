import { Position } from './Position';

describe('Position', () => {
  describe('getRandomPosition', () => {
    it('should be able to get a random position', () => {
      const position = Position.getRandomPosition(10, 10);
      expect(position).toBeInstanceOf(Position);
    });
  });

  describe('getDistance', () => {
    it('should be able to get the distance between two positions', () => {
      const position = new Position(0, 0);
      const position2 = new Position(0, 1);
      expect(position.getDistance(position2)).toBe(1);

      const position3 = new Position(0, 0);
      const position4 = new Position(1, 1);
      expect(position3.getDistance(position4)).toBe(2);
    });
  });
});
