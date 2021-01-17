import *as PIXI from 'pixi.js'
import Model from "./model";
import {TGameStateModel, TGameStateView, TInfoBlock} from "./GameTypes";

export default class View {

    private _model: Model;

    private _element: Element | null; //дом. елемент
    private readonly WIDTH: number; //ширина ігрового поля
    private readonly HEIGHT: number; //висота ігрового поля
    private readonly WIDTH_GAME_BLOCK: number = 66;
    private readonly HEIGHT_GAME_BLOCK: number = 66;
    private _app: PIXI.Application; //полотно
    private _background: PIXI.Sprite; //беграунд
    private _frame: PIXI.Sprite; //
    private _gameBlockSprite: PIXI.Sprite[][] = []; //масив ігрових блоків
    private _infoBlock: TInfoBlock[] = [];


    constructor(element: Element | null, width: number, height: number, model: Model) {
        this._element = element;
        this.WIDTH = width;
        this.HEIGHT = height;
        this._model = model;

        this._app = new PIXI.Application({
            width: this.WIDTH, //ширина ігрового полотна
            height: this.HEIGHT, //висота ігрового полотна
            backgroundColor: 0x111111, // колір полотна
            resolution: window.devicePixelRatio || 1,
        });
        this.init();
        this.createBackground()///////
        this.renderMainScreen() //////////////
    }

    private init(): void {
        const state = this._model.getStateModel();
        document.body.appendChild(this._app.view); //додаємо полотно, яке створили
        this._gameBlockSprite = this.createPlayField(state);
    }

    public gameStateView(): TGameStateView {
        return {
            gameBlockSprite: this._gameBlockSprite,
            infoBlock: this._infoBlock,
        }
    }

    //------------------- createSprite ---------------------//
    //створюємо ігрове поле
    private createPlayField({playField}: TGameStateModel): PIXI.Sprite[][] {
        const gameBlockSprite: PIXI.Sprite[][] = [];
        const displacementX: number = 370;
        const displacementY: number = 123;
        for (let y = 0; y < playField.length; y++) {
            gameBlockSprite[y] = [];
            for (let x = 0; x < playField[y].length; x++) {
                let numberBlock = playField[y][x].typeBlock;
                let blockX = (playField[y][x].x * (this.WIDTH_GAME_BLOCK + 2)) + displacementX;
                let blockY = (playField[y][x].y * (this.HEIGHT_GAME_BLOCK + 2)) + displacementY;
                let alpha = playField[y][x].alpha;
                let gameBlock: PIXI.Sprite = this.createGameBlock(numberBlock,blockX,blockY,this.HEIGHT_GAME_BLOCK,this.WIDTH_GAME_BLOCK,alpha, y + '_' + x);
                gameBlock.interactive = true;
                gameBlock.buttonMode = true;
                gameBlock.on('pointerdown',()=>{
                    let info: TInfoBlock = {
                        name: gameBlock.name,
                        x: gameBlock.x,
                        y: gameBlock.y
                    }
                    gameBlock.alpha = 0.5;
                    this._infoBlock.push(info);
                })
                gameBlockSprite[y].push(gameBlock);
            }

        }
        return gameBlockSprite;
    }

    //створюємо беграунд
    private createBackground(): void {
        this._background = this.createElementGame('./assets/background.jpg',0,0,720,940,1,'background');
        this._frame = this.createElementGame('./assets/frame.png',0,0,720,940,1,'frame');
    }
    //створюємо ігровий блок
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
    //створюємо ігрові блоки
    private createGameBlock(numberBlock: number,x: number, y: number, height: number, width: number, alpha: number, name: string): PIXI.Sprite  {
        let block: PIXI.Sprite = new PIXI.Sprite;
        switch (numberBlock) {
            case 1:
                block = this.createElementGame('./assets/Blue.jpg',x,y,height,width, alpha,'blue_' + name);
                break;
            case 2:
                block = this.createElementGame('./assets/Green.jpg',x,y,height,width, alpha,'green_' + name);
                break;
            case 3:
                block = this.createElementGame('./assets/Red.jpg',x,y,height,width, alpha,'red_' + name);
                break;
            case 4:
                block = this.createElementGame('./assets/White.jpg',x,y,height,width, alpha,'white_' + name);
                break;
            case 5:
                block = this.createElementGame('./assets/Yellow.jpg',x,y,height,width, alpha,'yellow_' + name);
                break;
        }
        return block;
    }
    //------------------- renderSprite ---------------------//
    //малюємо ігровий екран
    public renderMainScreen(): void {
        this.renderBackground(); //малюємо ігрове поле
        this.renderPlayField();
        this.renderFrame();
    }
    //малюємо беграунд
    private renderBackground(): void {
        this._app.stage.addChild(this._background);
    }

    private renderFrame(): void {
        this._app.stage.addChild(this._frame);
    }

    private renderPlayField(): void {
        for (let y = 0; y < this._gameBlockSprite.length; y++) {
            for (let x = 0; x < this._gameBlockSprite[y].length; x++) {
                this._app.stage.addChild(this._gameBlockSprite[y][x]);
            }
        }
    }

}