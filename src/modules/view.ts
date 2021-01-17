import *as PIXI from 'pixi.js'
import Model from "./model";
import {TGameState} from "./GameTypes";

export default class View {

    private _model: Model;

    private _element: Element | null; //дом. елемент
    private readonly WIDTH: number; //ширина ігрового поля
    private readonly HEIGHT: number; //висота ігрового поля
    private _app: PIXI.Application; //полотно
    private _background: PIXI.Sprite; //беграунд


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
        document.body.appendChild(this._app.view); //додаємо полотно, яке створили
    }

    //------------------- createSprite ---------------------//
    //створюємо ігрове поле
    private createPlayField({playField}: TGameState): void {


    }
    //створюємо беграунд
    private createBackground(): void {
        this._background = this.createElementGame('./background.jpg',0,0,940,720,'background');
    }
    //створюємо ігровий блок
    private createElementGame (name: string,x: number, y: number,height: number, width: number, nameBlock: string): PIXI.Sprite {
        const sprite = PIXI.Sprite.from(name);
        sprite.x = x;
        sprite.y = y;
        sprite.height = height;
        sprite.width = width;
        sprite.name = nameBlock;
        return sprite;
    }
    //------------------- renderSprite ---------------------//
    //малюємо ігровий екран
    public renderMainScreen(): void {
        this.renderPlayField(); //малюємо ігрове поле
    }
    //малюємо ігрове поле
    private renderPlayField(): void {
        this._app.stage.addChild(this._background);
    }

}