import * as PIXI from 'pixi.js';
import { starFactory } from '../../game-object-factories/star-factory';
import Routing from '../../scripts/routing';
import OkButton from '../../utility-classes/ok-button';
import Point from '../../utility-classes/point';

export default function EndOfGameScreen(app: PIXI.Application): PIXI.Container {
  const endOfGameContainer = new PIXI.Container();
  const backgroundBlock = new PIXI.Container();

  const plateLoader = new PIXI.Loader();
  plateLoader.add('infoPlate', 'ui/info_plate_big.png');
  plateLoader.add('okButton', 'ui/ok_button_active.png');
  plateLoader.add('okButtonPress', 'ui/ok_button_press.png');
  plateLoader.add('okButtonHover', 'ui/ok_button_hover.png');
  plateLoader.add('plateHeader', 'ui/header_info_plate.png');
  plateLoader.add('coin', 'ui/collect_coin_icon.png');
  plateLoader.add('leadButton', 'ui/leadboard_button_active.png');
  plateLoader.add('leadButtonPress', 'ui/leadboard_button_press.png');
  plateLoader.add('leadButtonHover', 'ui/leadboard_button_hover.png');
  plateLoader.add('rays', 'ui/rays.png');
  plateLoader.add('star', 'ui/star.png');

  plateLoader.load((loader, resources) => {
    const { width: screenWidth, height: screenHeight } = app.screen;
    const {
      infoPlate, okButton, okButtonPress, okButtonHover, plateHeader, coin,
      leadButton, leadButtonPress, leadButtonHover, rays, star,
    } = resources;
    const route = Routing.getRoute(['started-game', 'end-of-game']);

    const raysSprite = new PIXI.Sprite(rays.texture);
    const stars = starFactory.massProduce(
      star.texture,
      [new Point(120, 170), new Point(100, 320), new Point(80, 450), new Point(100, 580),
      new Point(720, 255), new Point(760, 385), new Point(740, 510), new Point(710, 650)],
    );
    backgroundBlock.addChild( raysSprite, ...stars.map(star => star.sprite));
    raysSprite.width = 900;
    raysSprite.height = 900;
    raysSprite.x = 0;
    raysSprite.y = 0;

    const infoPlateSprite = new PIXI.Sprite(infoPlate.texture);
    const titleBlock = new PIXI.Container();
    const plateHeaderSprite = new PIXI.Sprite(plateHeader.texture);
    const title = new PIXI.Text('Игра окончена', {
      fontSize: 30, fontWeight: '700', fill: 0x053e6b,
    });
    titleBlock.addChild(plateHeaderSprite, title);
    plateHeaderSprite.width = plateHeaderSprite.width * 0.5;
    plateHeaderSprite.height = plateHeaderSprite.height * 0.5;

    const contentBlock = new PIXI.Container();
    const coinSprite = new PIXI.Sprite(coin.texture);
    contentBlock.addChild(coinSprite);
    coinSprite.width = coinSprite.width * 0.5;
    coinSprite.height = coinSprite.height * 0.5;

    let textSprite: PIXI.Text | null = null;

    const confirmButton = new OkButton(
      new Point(screenWidth / 2, screenHeight / 2),
      new PIXI.AnimatedSprite([okButton.texture, okButtonPress.texture, okButtonHover.texture]),
      () => {
        Routing.navigate('main-menu');
        if (textSprite) textSprite.destroy();
      },
    );

    const recordsButton = new OkButton(
      new Point(screenWidth / 2, screenHeight / 2),
      new PIXI.AnimatedSprite([leadButton.texture, leadButtonPress.texture, leadButtonHover.texture]),
      () => {
        Routing.navigate('records-screen');
        if (textSprite) textSprite.destroy();
      }
    );

    let score = 0;
    route.on('navigatedTo', (data) => {
      if (!data || typeof data !== 'object') return;
      const { newRoutes } = data;
      score = newRoutes[newRoutes.length - 1].info.score;
      if (typeof score !== 'number') score = 0;
      
      const text = new PIXI.Text(`${score}`, {
        fontSize: 38, fontWeight: '600', fill: 0xefad23, wordWrap: true,
        wordWrapWidth: 400,
      });
      textSprite = text;

      contentBlock.addChild(text);

      text.x = 70;
      text.y = contentBlock.height / 2 - text.height / 2;
    });

    endOfGameContainer.addChild(
      infoPlateSprite, titleBlock,
      contentBlock, confirmButton.sprite, recordsButton.sprite,
    );

    infoPlateSprite.width = infoPlateSprite.width * 0.66;
    infoPlateSprite.height = infoPlateSprite.height * 0.66;

    const horizontalCenter = infoPlateSprite.x + infoPlateSprite.width / 2;
    const verticalCenter = infoPlateSprite.y + infoPlateSprite.height / 2;

    endOfGameContainer.x = screenWidth / 2 - infoPlateSprite.width / 2;
    endOfGameContainer.y = screenHeight / 2 - infoPlateSprite.height / 2;
    
    
    titleBlock.x = horizontalCenter - titleBlock.width / 2;
    titleBlock.y = infoPlateSprite.y + 5;
    title.x = titleBlock.width / 2 - title.width / 2;
    contentBlock.x = horizontalCenter - contentBlock.width / 2 - 25;
    contentBlock.y = verticalCenter - contentBlock.height / 2;
    confirmButton.x = horizontalCenter / 2 - confirmButton.width / 2;
    confirmButton.y = infoPlateSprite.y + infoPlateSprite.height - confirmButton.height - 30;
    recordsButton.sprite.width = recordsButton.width * 0.7;
    recordsButton.sprite.height = recordsButton.height * 0.7;
    recordsButton.x = horizontalCenter * 1.5 - recordsButton.width / 2;
    recordsButton.y = infoPlateSprite.y + infoPlateSprite.height - recordsButton.height - 30;
  });

  const container = new PIXI.Container();
  container.addChild(backgroundBlock, endOfGameContainer);
  app.stage.addChild(container);
  return container;
}