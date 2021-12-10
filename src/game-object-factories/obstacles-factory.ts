import * as PIXI from 'pixi.js';
import { AbstractGameObject, FactoryStrategy, GameObjectFactory } from './abstract-game-object';
import Point from '../utility-classes/point';

export class Obstacle extends AbstractGameObject {
  constructor(point: Point, sprite: PIXI.Sprite) {
    super(point, sprite);
    this.sprite.width = this.sprite.width * 0.4;
    this.sprite.height = this.sprite.height * 0.4;
  }
}

class obstacleStrategy implements FactoryStrategy<Obstacle> {
  massProduce(texture: PIXI.Texture, points: Point[]): Obstacle[] {
    return points.map(point => {
      return new Obstacle(point, new PIXI.Sprite(texture));
    });
  }
}

export const obstacleFactory = new GameObjectFactory(new obstacleStrategy());