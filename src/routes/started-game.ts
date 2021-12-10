import * as PIXI from 'pixi.js';
import { coinFactory } from '../game-object-factories/coins-factory';
import spritesDoIntersect from '../scripts/intersection-checker';
import { obstacleFactory } from '../game-object-factories/obstacles-factory';
import Point from '../utility-classes/point';
import { Terrain, terrainFactory } from '../game-object-factories/terrain-factory';
import ScoreTracker from '../scripts/score-tracker';
import Routing from '../scripts/routing';

function startGame(
  app: PIXI.Application,
  container: PIXI.Container,
  resources: PIXI.utils.Dict<PIXI.LoaderResource>
) {
  container.removeChildren();
  const { width: screenWidth, height: screenHeight } = app.screen;
  const {
    floor, character, characterJump, obstacle, coin, inGameScorePlate,
   } = resources;
    const terrainStartingY = screenHeight - 207;

    // create character
    const characterSprite = new PIXI.AnimatedSprite([
      character.texture,
      characterJump.texture
    ]);

    characterSprite.width = characterSprite.width / 2;
    characterSprite.height = characterSprite.height / 2;
    characterSprite.x = 100;

    container.addChild(characterSprite);
    characterSprite.y = terrainStartingY - characterSprite.height + 5;


    // Create terrain.
    const maxTerrains = 50;
    const terrainPoints: Point[] = [];

    for (let i = 0; i < maxTerrains; i++) {
      terrainPoints.push(new Point(screenWidth * i, terrainStartingY));
    }

    const terrain = terrainFactory.massProduce(
      floor.texture,
      terrainPoints,
    );
    terrain.forEach(currentTerrain => {
      container.addChild(currentTerrain.sprite);
    });
    

    // Create obstacles.
    const obstacleStartingY = terrainStartingY - 51;
    const maxObstacles = 98;
    const obstaclePoints: Point[] = [];
    let lastObstacleX = 0;

    for (let i = 1; i <= maxObstacles; i++) {
      const x = lastObstacleX + 450
        + Math.round(650 - (650 * Math.random()));
      lastObstacleX = x;
      obstaclePoints.push(new Point(x, obstacleStartingY));
    }
    const obstacles = obstacleFactory.massProduce(
      obstacle.texture,
      obstaclePoints,
    );

    obstacles.forEach(currentObstacle => {
      container.addChild(currentObstacle.sprite);
    });

    // Create coins.

    const coinStartingHeight = terrainStartingY - 55;
    const maxCoins = 500;
    const coinPoints: Point[] = [];
    let increaseHeight = false;
    let lastIncrease = 0;
    let screenNumber = 0;

    for (let i = 1; i <= maxCoins; i++) {
      if (!increaseHeight) increaseHeight = !!Math.round(Math.random() - 0.3);
      const x = screenWidth * screenNumber
        + (screenWidth - screenWidth / 10 * (i % 10)) + 128;
      if (increaseHeight) lastIncrease += 30;
      let y = increaseHeight
        ? coinStartingHeight - lastIncrease
        : coinStartingHeight;
      
      if (lastIncrease > 180) {
        y = coinStartingHeight - 180;
        increaseHeight = false;
        lastIncrease = 0;
      }
      coinPoints.push(new Point(x, y));
      if (i % 10 === 0) {
        screenNumber++;
      }
    }

    const coins = coinFactory.massProduce(
      coin.texture,
      coinPoints,
    );
    coins.forEach(currentCoin => {
      const spawnedInsideObstacle = obstacles.some(currentObstacle => {
        return spritesDoIntersect(currentCoin.sprite, currentObstacle.sprite)
      });
      if (spawnedInsideObstacle) currentCoin.y = coinStartingHeight - 150;
      container.addChild(currentCoin.sprite);
    });

    // Turn on character's jump.

    const jumpHeight = 180;
    const initialY = characterSprite.y;
    let direction = -1;
    let elapsed = 0;
    let isJumping = false;

    const jumpTicker = (delta: number) => {
      elapsed += delta;
      if (direction < 0) {
        characterSprite.y -= Math.round(20 - elapsed);
      }
      if (direction > 0) {
        characterSprite.y += Math.round(elapsed / 5);
      }
      
      if (characterSprite.y <= initialY - jumpHeight && direction === -1) {
        direction = 1;
        elapsed = 0;
        return;
      }
      if (characterSprite.y >= initialY && direction === 1) {
        app.ticker.remove(jumpTicker);  
        characterSprite.gotoAndStop(0);
        characterSprite.y = initialY;
        isJumping = false;
        elapsed = 0;
        direction = -1;
      }
    };

    const keyDownHandler = (event: KeyboardEvent) => {
      if (isJumping || event.code !== 'Space') return;
      isJumping = true;
      characterSprite.gotoAndStop(1);
      app.ticker.add(jumpTicker);
    };

    document.addEventListener('keydown', keyDownHandler);

    // Move terrain.

    const terrainSlideTicker = (delta: number) => {
      const speed = delta * 7;
      obstacles.forEach(currentObstacle => {
        currentObstacle.x -= Math.round(speed);
        currentObstacle.renderable = currentObstacle.x + currentObstacle.width > 0
          && currentObstacle.x < screenWidth;
      });

      coins.forEach(currentCoin => {
        currentCoin.x -= Math.round(speed);
        currentCoin.renderable = !currentCoin.isCollected
          && currentCoin.x + currentCoin.width > 0
          && currentCoin.x < screenWidth;
      });

      terrain.forEach(currentTerrain => {
        currentTerrain.x -= Math.round(speed);
        currentTerrain.renderable = currentTerrain.x + currentTerrain.width > 0
          && currentTerrain.x < screenWidth;
      });
    };

    // Collision checks for character.
    const scoreContainer = new PIXI.Container();
    const scorePlateSprite = new PIXI.Sprite(inGameScorePlate.texture);
    const coinIcon = new PIXI.Sprite(coin.texture);
    const scoreTracker = new ScoreTracker(
      new Point(0, 0),
      new PIXI.Text('', { fontSize: 40, fontWeight: '900',  fill: 0xffffff}),
    );
    scoreContainer.addChild(scorePlateSprite, coinIcon, scoreTracker.sprite);

    scoreContainer.x = screenWidth - scoreContainer.width;
    scoreContainer.y = 10;
    coinIcon.width = coinIcon.width * 0.75;
    coinIcon.height = coinIcon.height * 0.75;
    scoreTracker.x = coinIcon.width / 2 + scoreContainer.width / 2
      - scoreTracker.width / 2;
    scoreTracker.y = scoreContainer.height / 2 - scoreTracker.height / 2;

    scoreContainer.angle = -8;

    container.addChild(scoreContainer);

    const movementTicker = (delta: number) => {

      // End game on collision with obstacle.
      const finishGame = obstacles.some(currentObstacle => {
        if (spritesDoIntersect(characterSprite, currentObstacle.sprite)) {
          app.ticker.remove(terrainSlideTicker);
          app.ticker.remove(movementTicker);
          app.ticker.remove(jumpTicker);
          document.removeEventListener('keydown', keyDownHandler);
          scoreContainer.renderable = false;
          const route = Routing.getRoute(['started-game', 'end-of-game']);
          route.info.score = scoreTracker.score;
          const currentRecords = localStorage.getItem('bunnyRecords');
          const records = currentRecords ? JSON.parse(currentRecords) : [];
          if (Array.isArray(records)) {
            records.push(scoreTracker.score);
            records.sort();
            const toSave = JSON.stringify(records.slice(0, 10));
            localStorage.setItem('bunnyRecords', toSave);
          }
          
          scoreTracker.score = 0;
          Routing.navigate(['started-game', 'end-of-game']);
          scoreTracker.sprite.destroy();
          obstacles.forEach(currentObstacle => currentObstacle.sprite.destroy());
          coins.forEach(currentCoin => currentCoin.sprite.destroy());
          terrain.forEach(currentTerrain => currentTerrain.sprite.destroy());
          characterSprite.destroy();
          return true;
        }
        return false;
      });
      if (finishGame) return;
      // Collect coins on collision with them.
      coins.forEach(currentCoin => {
        if (!currentCoin.isCollected && spritesDoIntersect(characterSprite, currentCoin.sprite)) {
          scoreTracker.collectedCoin(currentCoin);
        }
      });
    }

    app.ticker.add(movementTicker);
    app.ticker.add(terrainSlideTicker);
}


export default function StartedGame(app: PIXI.Application): PIXI.Container {
  const startedGameContainer = new PIXI.Container();
  const imageLoader = new PIXI.Loader();
  imageLoader.add('floor', 'assets/floor.png');
  imageLoader.add('character', 'assets/character.png');
  imageLoader.add('characterJump', 'assets/character-jump.png');
  imageLoader.add('obstacle', 'assets/stopper_idle.png');
  imageLoader.add('coin', 'assets/ui/collect_coin_icon.png');
  imageLoader.add('inGameScorePlate', 'assets/ui/coin_score_plate.png');
  startedGameContainer.angle = 8;
  app.stage.addChild(startedGameContainer);

  imageLoader.load((loader, resources) => {
    const route = Routing.getRoute('started-game');
    route.on('navigatedTo', () => startGame(app, startedGameContainer, resources));
  });

  

  return startedGameContainer;
}