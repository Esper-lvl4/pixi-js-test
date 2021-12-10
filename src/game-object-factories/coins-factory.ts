import * as PIXI from 'pixi.js';
import { AbstractGameObject, FactoryStrategy, GameObjectFactory } from './abstract-game-object';
import Point from '../utility-classes/point';

export class Coin extends AbstractGameObject {
  point: Point;
  sprite: PIXI.Sprite;
  isCollected: boolean = false;

  constructor(point: Point, sprite: PIXI.Sprite) {
    super(point, sprite)
    this.sprite.width = this.sprite.width * 0.5;
    this.sprite.height = this.sprite.height * 0.5;
  }
}

class coinStrategy implements FactoryStrategy<Coin> {
  massProduce(texture: PIXI.Texture, points: Point[]): Coin[] {
    return points.map(point => {
      return new Coin(point, new PIXI.Sprite(texture));
    });
  }
}

export const coinFactory = new GameObjectFactory(new coinStrategy());