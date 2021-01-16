import {TGameObject, TGameState} from "./GameTypes";

export default class Model {
    //------------------- constants ---------------------//
    private readonly COLUMN_FIELD: number = 8; //кількість стовпців на полі
    private readonly LINE_FIELD: number = 8; //кількість рядків на полі

    //------------------- dataGame ---------------------//
    private _playField: TGameObject[][] = this.createGameField(); //ігрове поле
    private numbersOfFigures: number = 5; //кількість типів фігур в рівні

    constructor() {
        this.createGameField();
    }

    //------------------- manageStatus ---------------------//
    public getState(): TGameState {
        return {
            playField: this._playField,
        }
    }

    //------------------- createObject ---------------------//
    //  створюємо поле з ігровими обєктами
    private createGameField(): TGameObject[][] {
        const playField: TGameObject[][] = [];
        for (let y = 0; y < this.LINE_FIELD; y++) {
            playField[y] = [];
            for (let x = 0; x < this.COLUMN_FIELD; x++) {
                let gameElement: TGameObject = {
                    typeBlock: this.randomNumber(1, this.numbersOfFigures),
                    x: x,
                    y: y
                }
                playField[y].push(gameElement);
            }
        }
        return playField;
    }
    //  генератор випадковогочисла
    private randomNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

}