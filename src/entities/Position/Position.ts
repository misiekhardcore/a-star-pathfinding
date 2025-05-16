export class Position {
  constructor(
    public x: number,
    public y: number
  ) {}

  static getRandomPosition(maxX: number, maxY: number) {
    return new Position(Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY));
  }

  getDistance(position: Position): number {
    return Math.pow(position.x - this.x, 2) + Math.pow(position.y - this.y, 2);
  }
}
