import * as PIXI from 'pixi.js';
import { AbstractGameObject, FactoryStrategy, GameObjectFactory } from './abstract-game-object';
import Point from '../utility-classes/point';

export class Terrain extends AbstractGameObject {
  constructor(point: Point, sprite: PIXI.Sprite) {
    super(point, sprite);
    this.sprite.texture.frame = new PIXI.Rectangle(0, 0, 1280, 207);
    this.sprite.width = 1280;
    this.sprite.height = 207;
  }
}

class terrainStrategy implements FactoryStrategy<Terrain> {
  massProduce(texture: PIXI.Texture, points: Point[]): Terrain[] {
    return points.map(point => {
      return new Terrain(point, new PIXI.Sprite(texture));
    });
  }
}

export const terrainFactory = new GameObjectFactory(new terrainStrategy());