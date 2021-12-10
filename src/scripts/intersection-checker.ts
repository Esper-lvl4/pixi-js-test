import * as PIXI from 'pixi.js';

class RectanglePoints {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  y1: number;
  y2: number;
  y3: number;
  y4: number;

  constructor(item1: PIXI.Sprite) {
    const { x, y, width, height } = item1;
    this.x1 = x;
    this.x2 = x + width;
    this.x3 = x;
    this.x4 = x + width;
    this.y1 = y;
    this.y2 = y;
    this.y3 = y + height;
    this.y4 = y + height;
  }

  coordinatesAreInside(x: number, y: number): boolean {
    return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y3;
  }
}

export default function spritesDoIntersect(item1: PIXI.Sprite, item2: PIXI.Sprite): boolean {
  const { width: width1, height: height1 } = item1;
  const { width: width2, height: height2 } = item2;
  const firstRectangleIsSmaller = width1 * height1 < width2* height2;
  const rectangle1 = new RectanglePoints(firstRectangleIsSmaller ? item2 : item1);
  const rectangle2 = new RectanglePoints(firstRectangleIsSmaller ? item1 : item2);
  return rectangle1.coordinatesAreInside(rectangle2.x1, rectangle2.y1)
    || rectangle1.coordinatesAreInside(rectangle2.x2, rectangle2.y2)
    || rectangle1.coordinatesAreInside(rectangle2.x3, rectangle2.y3)
    || rectangle1.coordinatesAreInside(rectangle2.x4, rectangle2.y4);
};