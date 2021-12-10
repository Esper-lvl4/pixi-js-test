import * as PIXI from 'pixi.js';
import { AbstractGameObject, FactoryStrategy, GameObjectFactory } from './abstract-game-object';
import Point from '../utility-classes/point';

export class Star extends AbstractGameObject {
  constructor(point: Point, sprite: PIXI.Sprite) {
    super(point, sprite);
    this.sprite.width = this.sprite.width * 0.4;
    this.sprite.height = this.sprite.height * 0.4;
  }
}

class starStrategy implements FactoryStrategy<Star> {
  massProduce(texture: PIXI.Texture, points: Point[]): Star[] {
    return points.map(point => {
      return new Star(point, new PIXI.Sprite(texture));
    });
  }
}

export const starFactory = new GameObjectFactory(new starStrategy());