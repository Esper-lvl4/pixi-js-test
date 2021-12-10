import * as PIXI from 'pixi.js';
import Point from "../utility-classes/point";

export class AbstractGameObject {
  point: Point;
  sprite: PIXI.Sprite;

  constructor(point: Point, sprite: PIXI.Sprite) {
    this.point = point;
    this.sprite = sprite;
    this.sprite.x = this.x;
    this.sprite.y = this.y;
  }

  get x(): number {
    return this.point.x;
  }

  set x(value: number) {
    this.point.x = value;
    this.sprite.x = value;
  }

  get y(): number {
    return this.point.y;
  }

  set y(value: number) {
    this.point.y = value;
    this.sprite.y = value;
  }

  get width(): number {
    return this.sprite.width;
  }

  get height(): number {
    return this.sprite.height;
  }

  get renderable(): boolean {
    return this.sprite.renderable;
  }

  set renderable(value: boolean) {
    this.sprite.renderable = value;
  }
}

export class GameObjectFactory<T> {
  strategy: FactoryStrategy<T>;

  constructor(strategy: FactoryStrategy<T>) {
    this.strategy = strategy;
  }

  massProduce(texture: PIXI.Texture, points: Point[]): T[] {
    return this.strategy.massProduce(texture, points);
  } 
}

export interface FactoryStrategy<T> {
  massProduce: (texture: PIXI.Texture, points: Point[]) => T[];
}