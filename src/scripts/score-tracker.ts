import * as PIXI from 'pixi.js';
import { AbstractGameObject } from '../game-object-factories/abstract-game-object';
import { Coin } from "../game-object-factories/coins-factory";
import Point from '../utility-classes/point';

export default class ScoreTracker extends AbstractGameObject {
  private _score: number = 0;
  scorePerCoin: number = 1;
  sprite: PIXI.Text;

  constructor(point: Point, sprite: PIXI.Text, scorePerCoin: number = 1) {
    super(point, sprite);
    this.scorePerCoin = scorePerCoin;
    this.sprite = sprite;
    this.sprite.text = '0';
  }

  get score(): number {
    return this._score;
  }

  set score(value: number) {
    this._score = value;
    this.sprite.text = this._score.toString();
  }

  collectedCoin(coin: Coin) {
    this.score += this.scorePerCoin;
    coin.isCollected = true;
  }
}