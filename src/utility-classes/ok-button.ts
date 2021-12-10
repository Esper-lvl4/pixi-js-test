import * as PIXI from 'pixi.js';
import { AbstractGameObject } from "../game-object-factories/abstract-game-object";
import Point from "./point";

export default class OkButton extends AbstractGameObject {
  constructor(point: Point, sprite: PIXI.Sprite, handler: () => void) {
    super(point, sprite);
    sprite.interactive = true;
    sprite.buttonMode = true;
    if (this.sprite instanceof PIXI.AnimatedSprite) {
      const sprite = this.sprite;
      sprite.on('pointerover', () => sprite.gotoAndStop(2));
      sprite.on('pointerdown', () => sprite.gotoAndStop(1));
      sprite.on('pointerout', () => sprite.gotoAndStop(0))
    }
    sprite.on('pointerup', () => {
      if (this.sprite instanceof PIXI.AnimatedSprite) this.sprite.gotoAndStop(0);
      handler();
    });
  }
}