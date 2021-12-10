import * as PIXI from 'pixi.js';
import MainMenu from './routes/main-menu';
import RecordsScreen from './routes/records-screen';
import StartedGame from './routes/started-game';
import EndOfGameScreen from './routes/started-game/end-of-game';
import Routing from './scripts/routing';


const app = new PIXI.Application({ width: 900, height: 900, backgroundColor: 0xffffff });
document.body.appendChild(app.view);


Routing.provideApp(app);
Routing.addRoute('main-menu', MainMenu(app));
Routing.addRoute('started-game', StartedGame(app));
Routing.addRoute('records-screen', RecordsScreen(app));
Routing.addRoute(['started-game', 'end-of-game'], EndOfGameScreen(app));

Routing.navigate('main-menu');

/*

1) Fix Routing. +
2) Fix Collision calcs. +
3) Create a method for creating of coins, based on coordinates, so you can spam it. +
3.5) Create a method for creating of obstacles. +
4) Make everything move backwards, except for character. +
4.3) Make terrain, obstacles and coins mass generated. +
4.5) Start movement when entering started-game route, not at the app start. +
5) Make everything that is not on the screen not renderable, while it's out of screen. +
6) Make every movement stop, when you hit an obstacle and finish the game there. +
6.5) Collect coins on collision and track the score. +
7) When game is finished redirect to end of game screen, which will then redirect to main menu. +
8) Make a records screen.
9) When game is finished save the record (in local storage).
10) Have a list of records, that can be used alongside with the player's results if necessary.

*/