import * as PIXI from 'pixi.js'
import Model from "./model";

export default class View {

    private _model: Model;

    private _element: Element | null; //дом. елемент
    private readonly WIDTH: number; //ширина ігрового поля
    private readonly HEIGHT: number; //висота ігрового поля
    private _app: PIXI.Application;


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
    }

    private init(): void {
        document.body.appendChild(this._app.view);
    }
}