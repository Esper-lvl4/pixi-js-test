import * as PIXI from 'pixi.js';
import Routing from '../scripts/routing';
import OkButton from '../utility-classes/ok-button';
import Point from '../utility-classes/point';

interface RecordScore {
  name: string,
  score: number,
}

function loadRecords(
  app: PIXI.Application,
  container: PIXI.Container,
  resources: PIXI.utils.Dict<PIXI.LoaderResource>
) {
  container.removeChildren();
  const { width: screenWidth, height: screenHeight } = app.screen;
  const {
    infoPlate, okButton, okButtonPress, okButtonHover, plateHeader, 
    firstPlace, secondPlace, thirdPlace, topTen, scorePlate,
  } = resources;

  const infoPlateSprite = new PIXI.Sprite(infoPlate.texture);
  const titleBlock = new PIXI.Container();
  const plateHeaderSprite = new PIXI.Sprite(plateHeader.texture);
  const title = new PIXI.Text('Таблица рекордов', {
    fontSize: 28, fontWeight: '700', fill: 0x053e6b,
  });
  titleBlock.addChild(plateHeaderSprite, title);
  plateHeaderSprite.width = plateHeaderSprite.width * 0.5;
  plateHeaderSprite.height = plateHeaderSprite.height * 0.5;
  title.x = (plateHeaderSprite.x + plateHeaderSprite.width) / 2 - title.width / 2;

  const confirmButton = new OkButton(
    new Point(screenWidth / 2, screenHeight / 2),
    new PIXI.AnimatedSprite([okButton.texture, okButtonPress.texture, okButtonHover.texture]),
    () => {
      Routing.navigate('main-menu');
    },
  );
  
  const contentBlock = new PIXI.Container();
  const loadedRecords = localStorage.getItem('bunnyRecords');
  const records: RecordScore[] = (loadedRecords ? JSON.parse(loadedRecords) : [])
    .map((record: number) => ({ name: 'Игрок 1', score: record }));
  const dummyRecords: RecordScore[] = [
    { name: 'Андрей', score: 100 },
    { name: 'Виталя', score: 90 },
    { name: 'Петя', score: 80 },
    { name: 'Слава', score: 70 },
    { name: 'Вова', score: 60 },
    { name: 'Аркаша', score: 50 },
    { name: 'Сережа', score: 40 },
    { name: 'Игорь', score: 30 },
    { name: 'Илья', score: 20 },
    { name: 'Иван', score: 10 },
  ];

  let combinedRecords = records.concat(dummyRecords);
  combinedRecords.sort((item1, item2) => item1.score >= item2.score ? -1 : 1);
  combinedRecords = combinedRecords.slice(0, 10);
  const placesMap: {
    [key: string]: { color: number, nameTexture: PIXI.Texture, scoreTexture: PIXI.Texture }
  } = {
    '1': { color: 0xb27411, nameTexture: firstPlace.texture, scoreTexture: scorePlate.texture },
    '2': { color: 0x2f60a2, nameTexture: secondPlace.texture, scoreTexture: scorePlate.texture },
    '3': { color: 0x8a1f0b, nameTexture: thirdPlace.texture, scoreTexture: scorePlate.texture },
    'any': { color: 0x333333, nameTexture: topTen.texture, scoreTexture: scorePlate.texture },
  }
  const rows: PIXI.Container[] = combinedRecords.map((record, index) => {
    const { color, nameTexture, scoreTexture } = placesMap[index + 1] || placesMap.any;
    return createRecordRow({
      namePlateTexture: nameTexture, scorePlaceTexture: scoreTexture,
      color: color, name: record.name, score: record.score, place: index + 1,
    });
  });

  container.addChild(
    infoPlateSprite, titleBlock, contentBlock, confirmButton.sprite,
  );

  infoPlateSprite.width = infoPlateSprite.width * 0.72;
  infoPlateSprite.height = infoPlateSprite.height * 0.72;

  container.y = screenHeight / 2 - container.height / 2;
  container.x = screenWidth / 2 - container.width / 2;

  titleBlock.x = (infoPlateSprite.x + infoPlateSprite.width) / 2 - titleBlock.width / 2;
  titleBlock.y = 8;

  confirmButton.x = infoPlateSprite.x + infoPlateSprite.width / 2 - confirmButton.width / 2;
  confirmButton.y = infoPlateSprite.y + infoPlateSprite.height - confirmButton.height
    - 10;

  let currentY = 50;

  rows.forEach((row, index) => {
    const marginTop = index < 3 ? 8 : 5;
    const marginLeft = index < 3 ? 20 : 30;
    container.addChild(row);
    row.x = marginLeft;
    row.y = currentY + marginTop;
    currentY += marginTop + row.height;
  });
}

function createRecordRow(config: {
  namePlateTexture: PIXI.Texture,
  scorePlaceTexture: PIXI.Texture,
  color: number,
  name: string,
  score: number,
  place: number,
}): PIXI.Container {
  const recordRow = new PIXI.Container();
  const namePlate = new PIXI.Sprite(config.namePlateTexture);
  const scorePlate = new PIXI.Sprite(config.scorePlaceTexture);
  const name = new PIXI.Text(config.name, {
    fontSize: config.place < 4 ? 30 : 26, fill: config.color,
  });
  const score = new PIXI.Text(config.score.toString(), {
    fontSize: config.place < 4 ? 30 : 26, fill: config.color,
  });
  recordRow.addChild(namePlate, scorePlate, name, score);
  if (config.place >= 4) {
    namePlate.x = 35;
    const place = new PIXI.Text(config.place.toString(), {
      fontSize: 30, fill: 0xffffff,
    });
    recordRow.addChild(place);

    place.y = recordRow.height / 2 - place.height / 2;
    place.x = 15 - place.width / 2;
  }

  namePlate.width = namePlate.width * 0.7;
  namePlate.height = namePlate.height * 0.7;
  namePlate.y = recordRow.height / 2 - namePlate.height / 2;
  scorePlate.width = scorePlate.width * 0.7;
  scorePlate.height = scorePlate.height * (config.place < 4 ? 0.7 : 0.6);
  name.y = namePlate.y + namePlate.height / 2 - name.height / 2;
  name.x = config.place < 4 ? 60 : 50;
  scorePlate.x = namePlate.width + 10 + (config.place < 4 ? 0 : 40);
  scorePlate.y = config.place < 4
    ? recordRow.height / 2 - scorePlate.height / 2
    : namePlate.y;
  score.x = (scorePlate.x + scorePlate.width * 0.5) - score.width / 2;
  score.y = scorePlate.y + scorePlate.height * 0.5 - score.height / 2;


  return recordRow;
}

export default function RecordsScreen(app: PIXI.Application): PIXI.Container {
  const recordsScreenContainer = new PIXI.Container();
  const plateLoader = new PIXI.Loader();
  plateLoader.add('infoPlate', 'assets/ui/info_plate_big.png');
  plateLoader.add('plateHeader', 'assets/ui/header_info_plate.png');
  plateLoader.add('okButton', 'assets/ui/ok_button_active.png');
  plateLoader.add('okButtonPress', 'assets/ui/ok_button_press.png');
  plateLoader.add('okButtonHover', 'assets/ui/ok_button_hover.png');
  plateLoader.add('firstPlace', 'assets/ui/place_1.png');
  plateLoader.add('secondPlace', 'assets/ui/place_2.png');
  plateLoader.add('thirdPlace', 'assets/ui/place_3.png');
  plateLoader.add('topTen', 'assets/ui/midleader_name_plate.png');
  plateLoader.add('scorePlate', 'assets/ui/highleader_scores_plate.png');

  plateLoader.load((loader, resources) => {
    const route = Routing.getRoute('records-screen');
    route.on('navigatedTo', () => loadRecords(app, recordsScreenContainer, resources));
  });



  app.stage.addChild(recordsScreenContainer);
  return recordsScreenContainer;
}