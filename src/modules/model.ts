import {TGameObject, TGameStateModel, TInfoBlock} from "./GameTypes";
import * as TWEEN from '@tweenjs/tween.js'
import PIXI from "pixi.js";

export default class Model {
    //------------------- constants ---------------------//
    private readonly COLUMN_FIELD: number = 8; //кількість стовпців на полі
    private readonly LINE_FIELD: number = 8; //кількість рядків на полі

    //------------------- dataGame ---------------------//
    private _playField: TGameObject[][] = this.createGameField(); //ігрове поле
    private _numbersOfFigures: number = 5; //кількість типів фігур в рівні
    private _removeBlock: number[] = []; //блоки, що видаляємо
    private readonly BONUS_VELOCITY: number = 5;

    constructor() {
        this.checkStrings();
        this.checkColumns();
        this.checkStrings();
        this.checkColumns();
        console.log(this._playField);
        // this.checkStringsForTwo();
        // this.checkColumnsForTwo();
    }

    //------------------- manageStatus ---------------------//
    public getStateModel(): TGameStateModel {
        return {
            playField: this._playField,
            removeBlock: this._removeBlock,
        }
    }

    //------------------- createObject ---------------------//
    //  створюємо поле з ігровими обєктами
    private createGameField(): TGameObject[][] {
        const playField: TGameObject[][] = [];
        let numberBlock: number = 1;
        for (let y = 0; y < this.LINE_FIELD; y++) {
            playField[y] = [];
            for (let x = 0; x < this.COLUMN_FIELD; x++) {
                let typeBlock: number = this.randomNumber(1, 5);
                let gameElement: TGameObject = {
                    numberBlock: numberBlock,
                    typeBlock: typeBlock,
                    x: x,
                    y: y,
                    alpha: 0.8
                }
                numberBlock++;
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
    public moveBlocks(blockOne: TInfoBlock, blockTwo: TInfoBlock): TGameObject[][] {
        let nameOne: string[] = this.splitString(blockOne.name);
        let nameTwo: string[] = this.splitString(blockTwo.name);

        let nBO = this._playField[Number(nameOne[1])][Number(nameOne[2])].numberBlock;
        let nBT = this._playField[Number(nameTwo[1])][Number(nameTwo[2])].numberBlock;

        let tBO = this._playField[Number(nameOne[1])][Number(nameOne[2])].typeBlock;
        let tBT = this._playField[Number(nameTwo[1])][Number(nameTwo[2])].typeBlock;

        this._playField[Number(nameTwo[1])][Number(nameTwo[2])].numberBlock = nBO;
        this._playField[Number(nameOne[1])][Number(nameOne[2])].numberBlock = nBT;

        this._playField[Number(nameTwo[1])][Number(nameTwo[2])].typeBlock = tBO;
        this._playField[Number(nameOne[1])][Number(nameOne[2])].typeBlock = tBT;


        console.log(this._playField);
        return this._playField;
    }

    private splitString(name: string): string[] {
        return name.split('_')
    }

    public moveBlocksDown(): void {
        for (let y = this._playField.length - 1; y > 1; y--) {
            for (let x = 0; x < this._playField[y].length; x++) {
                if (this._playField[y][x].alpha == 0.5) {
                    let infoOne = {
                        name: this._playField[y][x].numberBlock + '_' + this._playField[y][x].y + '_' + this._playField[y][x].x,
                        x: this._playField[y][x].x,
                        y: this._playField[y][x].y,
                    }
                    let infoTwo = {
                        name: this._playField[y - 1][x].numberBlock + '_' + this._playField[y - 1][x].y + '_' + this._playField[y - 1][x].x,
                        x: this._playField[y - 1][x].x,
                        y: this._playField[y - 1][x].y,
                    }
                    //this.moveBlocks(infoOne,infoTwo);
                    console.log('move down')
                    // this._playField[y][x] = this._playField[y - 1][x];
                     //this._playField[y - 1][x].alpha = 0.1;
                }
            }
        }
    }
    //------------------- checksOfElements ---------------------//

    //перевірка рядків спрайтів на співпадіння більше трьох обєктів
    public checkStringsSprite(gameBlock: PIXI.Sprite[]): boolean {
        let removeBlock: number[];
        removeBlock = [];
        removeBlock.length = 0;
        console.log('+');
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 1; x < this._playField[y].length - 1; x++) {
                let nameOne = this._playField[y][x - 1].typeBlock;
                let nameTwo = this._playField[y][x].typeBlock;
                let nameThree = this._playField[y][x + 1].typeBlock;
                if (nameOne == nameTwo &&
                    nameTwo == nameThree) {
                    console.log('line')
                    removeBlock.push(this._playField[y][x - 1].numberBlock);
                    removeBlock.push(this._playField[y][x].numberBlock);
                    removeBlock.push(this._playField[y][x + 1].numberBlock);
                    // this._playField[y][x - 1].alpha = 0.5;
                    // this._playField[y][x].alpha = 0.5;
                    // this._playField[y][x + 1].alpha = 0.5;
                }
            }
        }
        for (let x = 0; x <this._playField[0].length; x++) {
            for (let y = 1; y < this._playField.length - 1; y++) {
                let nameOne = this._playField[y - 1][x].typeBlock;
                let nameTwo = this._playField[y][x].typeBlock;
                let nameThree = this._playField[y + 1][x].typeBlock;
                if (nameTwo == nameOne &&
                    nameTwo == nameThree) {
                    console.log('column')
                    removeBlock.push(this._playField[y - 1][x].numberBlock);
                    removeBlock.push(this._playField[y][x].numberBlock);
                    removeBlock.push(this._playField[y + 1][x].numberBlock);
                    // this._playField[y - 1][x].alpha = 0.5;
                    // this._playField[y][x].alpha = 0.5;
                    // this._playField[y + 1][x].alpha = 0.5;
                }
            }
        }
        console.log(removeBlock);
         this._removeBlock = removeBlock;
         return false;
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
    //------------------- deleteElements ---------------------//
    //перевірка на колізії
    private hasCollision(elementOne: PIXI.Sprite, elementTwo: PIXI.Sprite): boolean {

        const bounds1 = elementOne.getBounds();
        const bounds2 = elementTwo.getBounds();

        return bounds1.x + 2 < bounds2.x + bounds2.width + 2
            && bounds1.x + 2 + bounds1.width > bounds2.x + 2
            && (bounds1.y + 2) < bounds2.y + 2 + bounds2.height
            && (bounds1.y + 2 + bounds1.height) > (bounds2.y + 2);
    }

    private typeBlock(number: string): number {
        let block: number = 0;
        switch (number) {
            case 'blue':
                block = 1;
                break;
            case 'green':
                block = 2;
                break;
            case 'red':
                block = 3;
                break;
            case 'white':
                block = 4;
                break;
            case 'yellow':
                block = 5;
                break;
        }
        return block;
    }

}

