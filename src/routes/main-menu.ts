import * as PIXI from 'pixi.js';
import Routing from '../scripts/routing';

interface ButtonConfig {
  width: number;
  height: number;
  text: string;
}

function changeButtonBackground(background: PIXI.Graphics, color: number, config: ButtonConfig) {
  background.clear();
  background.beginFill(color);
  background.drawRoundedRect(0, 0, config.width, config.height, 25);
  background.endFill();
}

function createButton(config: ButtonConfig): PIXI.Container {
  const buttonColor = 0x6666ff;
  const buttonHoverColor = 0xffaa66;
  const button = new PIXI.Container();
  const background = new PIXI.Graphics();
  background.beginFill(buttonColor);
  background.drawRoundedRect(0, 0, config.width, config.height, 25);
  background.endFill();

  const text = new PIXI.Text(config.text, {
    fontSize: 18,
    fontWeight: '500',
    fill: 0xffffff,
  });
  text.x = background.width / 2 - text.width / 2;
  text.y = background.height / 2 - text.height / 2;

  button.addChild(background, text);

  button.interactive = true;
  button.buttonMode = true;

  button.on('pointerover', () => {
    changeButtonBackground(background, buttonHoverColor, config);
  })

  button.on('pointerout', () => {
    changeButtonBackground(background, buttonColor, config);
  })

  return button;
}

export default function MainMenu(app: PIXI.Application): PIXI.Container {
  const mainMenuContainer = new PIXI.Container();
  const buttonContainer = new PIXI.Container();
  const playButton = createButton({
    width: 200, height: 50, text: 'Play',
  });
  const recordsButton = createButton({
    width: 200, height: 50, text: 'Records',
  });
  recordsButton.y = 100;

  buttonContainer.addChild(playButton, recordsButton)
  buttonContainer.x = app.screen.width / 2 - (buttonContainer.width / 2);
  buttonContainer.y = app.screen.height / 2 - (buttonContainer.height / 2);

  playButton.on('pointerdown', () => {
    Routing.navigate('started-game');
  });

  recordsButton.on('pointerdown', () => {
    Routing.navigate('records-screen');
  });

  mainMenuContainer.addChild(buttonContainer);
  app.stage.addChild(mainMenuContainer);
  return mainMenuContainer;
}