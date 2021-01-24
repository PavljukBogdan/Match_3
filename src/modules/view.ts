import *as PIXI from 'pixi.js'
import Model from "./model";
import {TGameObject, TGameStateModel, TGameStateView, TInfoBlock} from "./GameTypes";

export default class View {

    private _model: Model;
    //------------------- constants ---------------------//
    private readonly WIDTH: number; //ширина ігрового поля
    private readonly HEIGHT: number; //висота ігрового поля
    private readonly WIDTH_GAME_BLOCK: number = 66; //ширина ігрового блоку
    private readonly HEIGHT_GAME_BLOCK: number = 66; //висота ігрового блоку
    //------------------- variables ---------------------//
    private _displacementX: number = 370; //стартова точка блоків по х
    private _displacementY: number = 120; //стартова точка блоків по у
    private _element: Element | null; //дом. елемент
    public app: PIXI.Application; //полотно
    private _background: PIXI.Sprite; //беграунд
    private _frame: PIXI.Sprite; //рамка
    private _infoBlock: TInfoBlock[] = []; //інформація по блоку, що отримуємо по кліку миші
    private _gameBlockSprite: PIXI.Sprite[] = []; //масив ігрових блоків
    private _taskLevelSprite: PIXI.Sprite;
    private _textScore: PIXI.Text;
    private _frameBlockSprite: PIXI.Sprite; //рамка
    private _host: string = './';

    constructor(element: Element | null, width: number, height: number, model: Model) {
        this._element = element;
        this.WIDTH = width;
        this.HEIGHT = height;
        this._model = model;

        this.app = new PIXI.Application({
            width: this.WIDTH, //ширина ігрового полотна
            height: this.HEIGHT, //висота ігрового полотна
            backgroundColor: 0x111111, // колір полотна
            resolution: window.devicePixelRatio || 1,
        });
        this.init();
    }
    private init(): void {
        document.body.appendChild(this.app.view); //додаємо полотно, яке створили
        this.createBackground(); //створюємо беграунд
        this.createTaskLevel();
        this.createTextScore();
        this._gameBlockSprite = this.createPlayField(this._model.getStateModel()); //створюємо ігрові блоки
        this.renderMainScreen();    //відмальовуємо екран
    }
    //повертаємо стан гри
    public gameStateView(): TGameStateView {
        return {
            gameBlockSprite: this._gameBlockSprite,
            infoBlock: this._infoBlock,
            HEIGHT_GAME_BLOCK: this.HEIGHT_GAME_BLOCK,
            WIDTH_GAME_BLOCK: this.WIDTH_GAME_BLOCK,
        }
    }
    //------------------- createSprite ---------------------//
    //створюємо беграунд
    private createBackground(): void {
        this._background = this.createElementGame(this._host + 'assets/background.jpg',0,0,720,940,1,'background');
        this._frameBlockSprite = this.createElementGame(this._host + 'assets/frameBlock.png',100,520,this.HEIGHT_GAME_BLOCK,this.WIDTH_GAME_BLOCK,1,'frameBlock');
    }
    //створюємо завдання рівня
    private createTaskLevel(): void {
        let levelBlock: TGameObject = this._model.getStateModel().taskBlock;
        let typeBlock: string = levelBlock.typeBlock;
        this._taskLevelSprite = this.createGameBlock(typeBlock,100,520,levelBlock);
        this._taskLevelSprite.alpha = 1;
        this._taskLevelSprite.interactive = false;
        this._frame = this.createElementGame(this._host + 'assets/frame.png',0,0,720,940,1,'frame');
    }
    //створюємо текст рівня
    private createTextScore(): void {
        const minorStyle = new PIXI.TextStyle({
            fontFamily: "\"Trebuchet MS\", Helvetica, sans-serif",
            fontSize: 40,
            fontWeight: "bold",
            stroke: "#b9bbbb",
            strokeThickness: 3
        });
        let text: number = this._model.getStateModel().numberTaskBlock;

        this._textScore = new PIXI.Text(` - ${text.toString()}`,minorStyle);
        this._textScore.x = 180;
        this._textScore.y = 525;

    }
    //створюємо ігрове поле
    private createPlayField({gameBlock}: TGameStateModel): PIXI.Sprite[] {
        const gameBlockSprite: PIXI.Sprite[] = [];
        for (let i = 0; i < gameBlock.length; i++) {
                let blockX =  gameBlock[i].x;
                let blockY =  gameBlock[i].y;
            let gBlock: PIXI.Sprite = this.createGameBlock(gameBlock[i].typeBlock, blockX, blockY,gameBlock[i]);

                gameBlockSprite.push(gBlock);
            }

        return gameBlockSprite;
    }
    //створюємо нові блоки першого ряду
    private addGameSprite({newGameBlock}: TGameStateModel): void {
        for (let i = 0; i < newGameBlock.length; i++) {
            let blockX =  newGameBlock[i].x;
            let blockY =  newGameBlock[i].y;
            let gBlock: PIXI.Sprite = this.createGameBlock(newGameBlock[i].typeBlock, blockX, blockY,newGameBlock[i]);
            this._gameBlockSprite.push(gBlock);
        }
    }
    //оновлюємо текст рівня
    public updateTextScreen(score: number): void {
        if (score > 0) {
            this._textScore.text = ` - ${score.toString()}`;
        } else {
            this._textScore.text = `win!!!`;
        }
    }
    //створюємо ігровий блок
    private createGameBlock(typeBlock: string,blockX: number,blockY: number, gameBlock: TGameObject): PIXI.Sprite {
        let alpha = gameBlock.alpha;
        let y = gameBlock.y;
        let x = gameBlock.x;
        let numberBlock = gameBlock.numberBlock;
        let gBlock: PIXI.Sprite = this.createSpriteGameBlock(typeBlock,
            blockX,blockY,
            this.HEIGHT_GAME_BLOCK,this.WIDTH_GAME_BLOCK,alpha,
            '_' + y + '_' + x + '_' + numberBlock);
        gBlock.interactive = true;
        gBlock.buttonMode = true;
        gBlock.on('pointerdown',()=> {
            let info: TInfoBlock = {
                name: gBlock.name,
                x: gBlock.x,
                y: gBlock.y
            }
            gBlock.alpha = 1;
            this._infoBlock.push(info);
        });
        return gBlock;

    }
    //створюємо ігровий лемент
    private createElementGame (name: string,x: number, y: number,height: number, width: number, alpha: number, nameBlock: string): PIXI.Sprite {
        const sprite = PIXI.Sprite.from(name);
        sprite.x = x;
        sprite.y = y;
        sprite.height = height;
        sprite.width = width;
        sprite.name = nameBlock;
        sprite.alpha = alpha;
        return sprite;
    }
    //створюємо ігровий блок відповідно до його імені
    private createSpriteGameBlock(nameBlock: string,x: number, y: number, height: number, width: number, alpha: number, name: string): PIXI.Sprite  {
        let block: PIXI.Sprite = new PIXI.Sprite;
        switch (nameBlock) {
            case 'Blue':
                block = this.createElementGame(this._host  + 'assets/Blue.jpg',x,y,height,width, alpha,nameBlock + name);
                break;
            case 'Green':
                block = this.createElementGame(this._host + 'assets/Green.jpg',x,y,height,width, alpha,nameBlock + name);
                break;
            case 'Red':
                block = this.createElementGame(this._host  + 'assets/Red.jpg',x,y,height,width, alpha,nameBlock + name);
                break;
            case 'White':
                block = this.createElementGame(this._host + 'assets/White.jpg',x,y,height,width, alpha,nameBlock + name);
                break;
            case 'Yellow':
                block = this.createElementGame(this._host + 'assets/Yellow.jpg',x,y,height,width, alpha,nameBlock + name);
                break;
        }
        return block;
    }
    //------------------- removeSprite ---------------------//
    //оновлюємо стан спрайтів
    public updateSprite(): void {
        this.removeSprite(this._model.getStateModel());
        this.addGameSprite(this._model.getStateModel());
    }
    //видаляємо з масиву спрайти
    private removeSprite({removeBlockNumber}: TGameStateModel): void {
        console.log(this._gameBlockSprite);
        for (let i = 0; i < this._gameBlockSprite.length; i++) {
            let nameSprite: string[] = this._gameBlockSprite[i].name.split('_');
            for (let j = 0; j < removeBlockNumber.length; j++) { //номери співпадають, видаляємо спрайт
                if (Number(nameSprite[nameSprite.length - 1]) == removeBlockNumber[j].numberBlock) {
                    this._gameBlockSprite.splice(i,1);
                }
            }
        }
        console.log(this._gameBlockSprite);
    }
    //------------------- renderSprite ---------------------//
    //малюємо || оновлюємо ігровий екран
    public renderMainScreen(): void {
        this.renderBackground(); //малюємо ігрове поле
        this.renderTaskLevel();
        this.renderTextScreen();
        this.renderBlock(this._model.getStateModel()); //малюємо блоки
        this.renderFrame(); //малюємо рамку
    }
    //малюємо текст рівня
    private renderTextScreen(): void {
        this.app.stage.addChild(this._textScore);
    }
    //малюємо завдання на рівень
    private renderTaskLevel(): void {
        this.app.stage.addChild(this._taskLevelSprite);
        this.app.stage.addChild(this._frameBlockSprite);
    }
    //малюємо беграунд
    private renderBackground(): void {
        this.app.stage.addChild(this._background);
    }
    //малюємо рамку
    private renderFrame(): void {
        this.app.stage.addChild(this._frame);
    }
    //малюємо блоки
    private renderBlock({playField}: TGameStateModel): void {
        for (let i = 0; i < this._gameBlockSprite.length; i++) {
            let name: string[] = this._gameBlockSprite[i].name.split('_');
            for (let y = 0; y < playField.length; y++) {
                for (let x = 0; x < playField[y].length; x++) {
                    if (Number(name[name.length - 1]) == playField[y][x].numberBlock) { //якщо номер блока співпадає з номером на полі, малюєм його по координатах з поля
                        this._gameBlockSprite[i].y = (playField[y][x].y * (this.WIDTH_GAME_BLOCK + 2) + this._displacementY);
                        this._gameBlockSprite[i].x = (playField[y][x].x * (this.WIDTH_GAME_BLOCK + 2) + this._displacementX);
                        this.app.stage.addChild(this._gameBlockSprite[i]);
                    }
                }
            }
        }
    }
    //оновлюємо значення альфа каналу
    public updateAlpha(): void {
        for (let i = 0; i < this._gameBlockSprite.length; i++) {
            this._gameBlockSprite[i].alpha = 0.7;
        }
    }
}