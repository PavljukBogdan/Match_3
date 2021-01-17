import {TGameObject, TGameStateModel, TInfoBlock} from "./GameTypes";
import * as TWEEN from '@tweenjs/tween.js'

export default class Model {
    //------------------- constants ---------------------//
    private readonly COLUMN_FIELD: number = 8; //кількість стовпців на полі
    private readonly LINE_FIELD: number = 8; //кількість рядків на полі

    //------------------- dataGame ---------------------//
    private _playField: TGameObject[][] = this.createGameField(); //ігрове поле
    private _numbersOfFigures: number = 5; //кількість типів фігур в рівні

    constructor() {
        this.checkStrings();
        this.checkColumns();
        this.checkStrings();
        this.checkColumns();
        this.checkStringsForTwo();
        this.checkColumnsForTwo();
    }

    //------------------- manageStatus ---------------------//
    public getStateModel(): TGameStateModel {
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
                let typeBlock: number = this.randomNumber(1, 5);
                let gameElement: TGameObject = {
                    typeBlock: typeBlock,
                    x: x,
                    y: y,
                    alpha: 0.2
                }
                playField[y].push(gameElement);
            }
        }
        return playField;
    }
    //  генератор випадкового числа
    private randomNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private newRandomNumber(number: number): number {
        let newNumber: number = this.randomNumber(1, 5);
        if (number == newNumber) {
            return newNumber = this.newRandomNumber(number);
        } else
            return newNumber;
    }
    //------------------- movementOfElements ---------------------//
    public moveBlocks(gameBlockSprite: PIXI.Sprite[][], blockOne: TInfoBlock, blockTwo: TInfoBlock): void {
        let cordOne = null;
        let cordTwo = null;
        for (let y = 0; y < gameBlockSprite.length; y++) {
            let indexY = gameBlockSprite.indexOf(gameBlockSprite[y]);
            for (let x = 0; x < gameBlockSprite[y].length; x++) {
                if (gameBlockSprite[y][x].name == blockOne.name) {
                    gameBlockSprite[y][x].x = blockTwo.x;
                    gameBlockSprite[y][x].y = blockTwo.y;
                    let indexX = gameBlockSprite[y].indexOf(gameBlockSprite[y][x]);
                    cordOne = {
                        y: indexY,
                        x: indexX
                    }
                }
                if (gameBlockSprite[y][x].name == blockTwo.name) {
                    gameBlockSprite[y][x].x = blockOne.x;
                    gameBlockSprite[y][x].y = blockOne.y;
                    let indexX = gameBlockSprite[y].indexOf(gameBlockSprite[y][x]);
                    cordTwo = {
                        y: indexY,
                        x: indexX
                    }
                }
            }
        }
        if (cordOne != null && cordTwo != null) {
            let buffer = gameBlockSprite[cordOne.y][cordOne.x];
            gameBlockSprite[cordOne.y][cordOne.x] = gameBlockSprite[cordTwo.y][cordTwo.x];
            gameBlockSprite[cordTwo.y][cordTwo.x] = buffer;
        }
    }

    //------------------- checksOfElements ---------------------//

    //перевірка рядків спрайтів на співпадіння більше трьох обєктів
    public checkStringsSprite(gameBlock: PIXI.Sprite[][]): void {
        for (let y = 0; y < gameBlock.length; y++) {
            for (let x = 1; x < gameBlock[y].length - 1; x++) {
                let nameOne = gameBlock[y][x - 1].name.split('_');
                let nameTwo = gameBlock[y][x].name.split('_');
                let nameThree = gameBlock[y][x + 1].name.split('_');
                if (nameOne[0] == nameTwo[0]) {
                    if (nameTwo[0] == nameThree[0]) {
                        gameBlock[y][x - 1].alpha = 0;
                        gameBlock[y][x].alpha = 0;
                        gameBlock[y][x + 1].alpha = 0;
                    }
                }
            }
        }
        for (let x = 0; x < gameBlock[0].length; x++) {
            for (let y = 1; y < gameBlock.length - 1; y++) {
                let nameOne = gameBlock[y - 1][x].name.split('_');
                let nameTwo = gameBlock[y][x].name.split('_');
                let nameThree = gameBlock[y + 1][x].name.split('_');
                if (nameTwo[0] == nameOne[0] &&
                    nameTwo[0] == nameThree[0]) {
                    gameBlock[y - 1][x].alpha = 0;
                    gameBlock[y][x].alpha = 0;
                    gameBlock[y + 1][x].alpha = 0;
                }
            }
        }

    }
    //перевірка рядків на співпадіння більше трьох обєктів
    private checkStrings(): void {
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 1; x < this._playField[y].length - 1; x++) {
                if (this._playField[y][x].typeBlock == this._playField[y][x - 1].typeBlock &&
                    this._playField[y][x].typeBlock == this._playField[y][x + 1].typeBlock) {
                    this._playField[y][x].typeBlock = this.newRandomNumber(this._playField[y][x].typeBlock);
                }
            }
        }
    }
    //перевірка стовпів на співпадіння більше трьох обєктів
    private checkColumns(): void {
        for (let x = 0; x < this._playField[0].length; x++) {
            for (let y = 1; y < this._playField.length - 1; y++) {
                if (this._playField[y][x].typeBlock == this._playField[y - 1][x].typeBlock &&
                    this._playField[y][x].typeBlock == this._playField[y + 1][x].typeBlock) {
                    this._playField[y][x].typeBlock = this.newRandomNumber(this._playField[y][x].typeBlock);
                }
            }
        }
    }
    //перевірка рядків на співпадіння двох обєктів
    private checkStringsForTwo(): void {
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 1; x < this._playField[y].length - 1; x++) {
                if (this._playField[y][x].typeBlock == this._playField[y][x - 1].typeBlock ||
                    this._playField[y][x].typeBlock == this._playField[y][x + 1].typeBlock) {
                    this._playField[y][x - 1].alpha = 1;
                    this._playField[y][x].alpha = 1;
                    this._playField[y][x + 1].alpha = 1;
                }
            }
        }
    }
    //перевірка стовпів на співпадіння двох обєктів
    private checkColumnsForTwo(): void {
        for (let x = 0; x < this._playField[0].length; x++) {
            for (let y = 1; y < this._playField.length - 1; y++) {
                if (this._playField[y][x].typeBlock == this._playField[y - 1][x].typeBlock ||
                    this._playField[y][x].typeBlock == this._playField[y + 1][x].typeBlock) {
                    this._playField[y - 1][x].alpha = 1;
                    this._playField[y][x].alpha = 1;
                    this._playField[y + 1][x].alpha = 1;
                }
            }
        }
    }

}