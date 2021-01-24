import {TСoordinates, TGameObject, TGameStateModel, TInfoBlock} from "./GameTypes";

export default class Model {

    //------------------- constants ---------------------//
    private readonly COLUMN_FIELD: number = 8; //кількість стовпців на полі
    private readonly LINE_FIELD: number = 8; //кількість рядків на полі
    private readonly ALPHA_SPRITE: number = 0.7;
    //------------------- variables ---------------------//
    private _numberBlock: number = 1; //номер створуного блоку
    private _playField: TGameObject[][] = this.createPlayField(); //створюємо ігрове поле
    private _gameBlock: TGameObject[] = this.createGameBlocks(); //створюємо ігрові обєкти
    private _removeBlockNumber: TGameObject[] = []; //номера блоків для видалення
    private _newGameBlock: TGameObject[] = []; //нові блоки, що створюються
    private _taskBlock: TGameObject; //тип блоку на рівень
    private _numberTaskBlock: number; //потрібна кількість блоків на рівень

    constructor() {
        this.init();
    }
    //ініціалізація гри
    private init() {
        this.copyBlockOnField(); //копіюємо блоки на поле
        this.tasksLevel(); //створюємо завдання на рівень
        this.startCheckField(); //перевіряємо поле на зібрані три в ряд
    }
    //------------------- manageStatus ---------------------//
    //повертаємо стан моделі
    public getStateModel(): TGameStateModel {
        return {
            gameBlock: this._gameBlock,
            playField: this._playField,
            newGameBlock: this._newGameBlock,
            removeBlockNumber: this._removeBlockNumber,
            taskBlock: this._taskBlock,
            numberTaskBlock: this._numberTaskBlock,
        }
    }
    //завдання на рівень
    private tasksLevel(): void {
        this._taskBlock = this.createGameBlock(0,0); //створюємо блок для завдання
        this._numberTaskBlock = this.randomNumber(20,40); //створюємо потрібну кількість блоків
    }
    //------------------- createObject ---------------------//
    //створюємо ігрове поле
    private createPlayField(): TGameObject[][] {
        const playField:TGameObject[][] = [];
        for (let y = 0; y < this.LINE_FIELD; y++) {
            playField[y] = new Array(this.COLUMN_FIELD).fill(0); //заповнюємо рядок нулями
        }
        return playField; //створюємо масив ігрового поля 8х8
    }
    //створюємо ігрові блоки
    private createGameBlocks(): TGameObject[] {
        const gameBlock: TGameObject[] = [];
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 0; x < this._playField[y].length; x++) {
                let gameElement: TGameObject = this.createGameBlock(x,y);
                gameBlock.push(gameElement);
            }
        }
        return gameBlock;
    }
    //створюємо ігровий блок
    private createGameBlock(x: number, y: number): TGameObject {
        let numberType: number = this.randomNumber(1, 5); //отримуємо випадковий номер від 1 до 5 включно
        let typeBlock: string = this.createNameBlock(numberType); //отримуємо імя відповідно до номера
        this._numberBlock++;
        return  {    //створюємо ігровий обєкт
            numberBlock: this._numberBlock,
            numberType: numberType,
            typeBlock: typeBlock,
            x: x,
            y: y,
            alpha: this.ALPHA_SPRITE,
        }
    }
    //генеруємо імя блока по номеру
    private createNameBlock(numberBlock: number): string  {
        let block: string = '';
        switch (numberBlock) {
            case 1:
                block ='Blue';
                break;
            case 2:
                block = 'Green';
                break;
            case 3:
                block = 'Red';
                break;
            case 4:
                block = 'White';
                break;
            case 5:
                block = 'Yellow';
                break;
        }
        return block;
    }
    //генеруємо номер блока по імені
    private createNumberBlock(nameBlock: string): number  {
        let block: number = 0;
        switch (nameBlock) {
            case 'Blue':
                block =1;
                break;
            case 'Green':
                block = 2;
                break;
            case 'Red':
                block = 3;
                break;
            case 'White':
                block = 4;
                break;
            case 'Yellow':
                block = 5;
                break;
        }
        return block;
    }
    //  генератор випадкового числа
    private randomNumber(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    //  генератор випадкового числа за виключенням конкретного
    private newRandomNumber(number: number): number {
        let newNumber: number = this.randomNumber(1, 5);
        if (number == newNumber) {
            return newNumber = this.newRandomNumber(number);
        } else
            return newNumber;
    }
    //копіюємо фігури на поле
    private copyBlockOnField(): void {
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 0; x < this._playField[y].length; x++) {
                for (let i = 0; i < this._gameBlock.length; i++) {
                    if (y == this._gameBlock[i].y && //якщо координати збіглися - копіюємо
                        x == this._gameBlock[i].x) {
                        this._playField[y][x] = this._gameBlock[i];
                    }
                }
            }

        }
    }
    //------------------- movementOfElements ---------------------//
    //переміщаємо блоки
    public moveBlocks(blockOne: TInfoBlock, blockTwo: TInfoBlock): void {
        let nameOne: string[] = this.splitString(blockOne.name); //тримуємо імена блоків в масивах
        let nameTwo: string[] = this.splitString(blockTwo.name);
        let nothing: TGameObject =  { //створюємо пустиє обєккт
            alpha: 0,
                numberBlock:0,
                numberType:0,
                typeBlock: '',
                x: -1,
                y: -1,
        }
        let bufferOne: TGameObject = nothing; //створюємо два буффера
        let bufferTwo: TGameObject = nothing;
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 0; x < this._playField[y].length; x++) {
                if (Number(nameOne[nameOne.length - 1]) == this._playField[y][x].numberBlock) {
                    bufferOne = this._playField[y][x];
                }else if (Number(nameTwo[nameTwo.length - 1]) == this._playField[y][x].numberBlock) {
                    bufferTwo = this._playField[y][x];
                }
            }
        }
        this.replacementOfBlocksValues(bufferOne,bufferTwo); //міняємо місцями значення блоків
    }
    //зміна значень блоків
    private replacementOfBlocksValues(bufferOne: TGameObject, bufferTwo: TGameObject): void {

        let numBlock: number = this._playField[bufferOne.y][bufferOne.x].numberBlock;
        let name: string  =this._playField[bufferOne.y][bufferOne.x].typeBlock;

        this._playField[bufferOne.y][bufferOne.x].alpha = this.ALPHA_SPRITE;
        this._playField[bufferOne.y][bufferOne.x].numberBlock = bufferTwo.numberBlock;
        this._playField[bufferOne.y][bufferOne.x].typeBlock = bufferTwo.typeBlock;

        this._playField[bufferTwo.y][bufferTwo.x].alpha = this.ALPHA_SPRITE;
        this._playField[bufferTwo.y][bufferTwo.x].numberBlock = numBlock;
        this._playField[bufferTwo.y][bufferTwo.x].typeBlock = name;

    }
    //розділити строку на масив
    private splitString(name: string): string[] {
        return name.split('_')
    }
    //створюємо новий тип блоку по заданих координатах
    private createNewTypeBlock(coord: TСoordinates): void {
        for (let i = 0; i < coord.coordX.length; i++) {
            //генерація випадкового номера блоку, за виключенням попереднього типу
            let numberType: number = this.newRandomNumber(this.createNumberBlock(this._playField[coord.coordY[i]][coord.coordX[i]].typeBlock));
            //створюємо, та додаємо новий блок по координатах на ігрове поле
            this._playField[coord.coordY[i]][coord.coordX[i]].typeBlock = this.createNameBlock(numberType);
        }
    }
    //рухаємо блоки в рядках
    private moveBlocksOfColumn(numberColumn: number) {
        for (let y = 0; y < this._playField.length - 1; y++) {
            if (this._playField[y + 1][numberColumn].numberBlock == 0) {
                this._playField[y + 1][numberColumn].alpha = this._playField[y][numberColumn].alpha;
                this._playField[y + 1][numberColumn].numberBlock = this._playField[y][numberColumn].numberBlock;
                this._playField[y + 1][numberColumn].typeBlock = this._playField[y][numberColumn].typeBlock;

                this._playField[y][numberColumn].numberBlock = 0;
            }
        }
    }
    //------------------- checksOfElements ---------------------//
    //стартова перевірка на співпадіння трьох елементів
    private startCheckField(): void {
        this.createNewTypeBlock(this.checkStrings()); //створюємо нові блоки при перевірці строк
        this.createNewTypeBlock(this.checkColumns()); //створюємо нові блоки при перевірці стовпців,
        this.createNewTypeBlock(this.checkStrings()); //створюємо нові блоки при перевірці строк
        this.createNewTypeBlock(this.checkColumns()); //створюємо нові блоки при перевірці стовпців
    }
    //перевірка рядків спрайтів на співпадіння більше трьох обєктів
    public gameCheckField(): void {
        let dellBlock: TGameObject[] = this.removeStringsColumns(); //видаляємо зібрані блоки
        this.checkBlockColumns(dellBlock); //перевіряємо стовпці на існування обєктів
            this._removeBlockNumber = dellBlock;
            this._newGameBlock = this.checkOneString(); //перевірка першого рядка на існування в ньому блоків
            this.copyBlockOnField();
            this._newGameBlock = this._newGameBlock.concat(this.createNewBlockColumns());
            this.copyBlockOnField();
    }
    //перевіряємо наявність зібраних ліній/стовпців
    public checkAssembledLines(): boolean {
        let strings = this.checkStrings();
        let columns = this.checkColumns();
        if (strings.coordX.length != 0 || columns.coordX.length != 0) {
            return true;
        }
        return false;
    }
    //видаляємо зібрані блоки
    private removeStringsColumns(): TGameObject[] {
        let dellBlock: TGameObject[] = [];
        let dellBlockStrings = this.dellBlock(this.checkStrings()); //при співпадінні видаляємо блоки з поля в строках
        let dellBlockColumns = this.dellBlock(this.checkColumns()); //при співпадінні видаляємо блоки з поля в стовпцях
        dellBlock = dellBlockStrings.concat(dellBlockColumns);
        return dellBlock;
    }
    //перевірка першого рядка на існування в ньому блоків
    private checkOneString(): TGameObject[] {
        let newGameBlock: TGameObject[] = [];
        const numString: number  = 0;
        for (let x = 0; x < this._playField.length; x++) {
            if (this._playField[numString][x].numberBlock == 0) {
                let newBlock: TGameObject = this.createGameBlock(x,numString);
                newGameBlock.push(newBlock);
                this._gameBlock.splice(x,1,newBlock);
            }
        }
        return newGameBlock;
    }
    //перевіряємо стовпці на існування обєктів
    private checkBlockColumns(dellBlock: TGameObject[]): void {
        for (let i = 0; i < dellBlock.length; i++) {
            for (let y = dellBlock[i].y; y > 0; y--) {
                this.moveBlocksOfColumn(this._playField[y][dellBlock[i].x].x);
            }
        }
    }
    private createNewBlockColumns(): TGameObject[] {
        let newGameBlock: TGameObject[] = [];
        for (let y = 0; y < this._playField[0].length; y++) {
            for (let x = 0; x < this._playField[y].length; x++) {
                if (this._playField[y][x].numberBlock == 0) {
                    let newBlock: TGameObject = this.createGameBlock(x,y);
                    newGameBlock.push(newBlock);
                    this._gameBlock.splice(x * y,1,newBlock);
                }
            }
        }
        for (let i = 0; i < newGameBlock.length; i++) {
            for (let j = 0; j < this._gameBlock.length; j++) {
                if (this._gameBlock[j].x == newGameBlock[i].x && this._gameBlock[j].y == newGameBlock[i].y) {
                    this._gameBlock.splice(j,1,newGameBlock[i]);
                }
            }
        }
        return newGameBlock;
    }
    //видалити блок по координатах
    private dellBlock(coord: TСoordinates): TGameObject[] {
        let dellBlock: TGameObject[] = [];
        for (let i = 0; i < coord.coordX.length; i++) {
            if (this._playField[coord.coordY[i]][coord.coordX[i]].typeBlock == this._taskBlock.typeBlock) {
                this._numberTaskBlock--;
            }
            let dB: TGameObject ={
                numberBlock: this._playField[coord.coordY[i]][coord.coordX[i]].numberBlock,
                numberType: this._playField[coord.coordY[i]][coord.coordX[i]].numberType,
                typeBlock: this._playField[coord.coordY[i]][coord.coordX[i]].typeBlock,
                x: this._playField[coord.coordY[i]][coord.coordX[i]].x,
                y: this._playField[coord.coordY[i]][coord.coordX[i]].y,
                alpha: this._playField[coord.coordY[i]][coord.coordX[i]].alpha,
            }
            dellBlock.push(dB); //додаємо елемент в масив
            this._playField[coord.coordY[i]][coord.coordX[i]].numberBlock = 0; //затираємо його на полі
        }
        console.log(dellBlock);
        return dellBlock; //овертаємо масив з номерами, що видалені
    }
    //перевірка рядків на співпадіння більше трьох обєктів
    private checkStrings(): TСoordinates {
        let coordY: number[] = [];
        let coordX: number[] = [];
        for (let y = 0; y < this._playField.length; y++) {
            for (let x = 1; x < this._playField[y].length - 1; x++) {
                if (this._playField[y][x].typeBlock == this._playField[y][x - 1].typeBlock &&
                    this._playField[y][x].typeBlock == this._playField[y][x + 1].typeBlock) {
                    coordY.push(y);
                    coordX.push(x - 1);
                    coordY.push(y);
                    coordX.push(x);
                    coordY.push(y);
                    coordX.push(x + 1);
                }
            }
        }

        return {
            coordY,
            coordX
        }
    }
    //перевірка стовпів на співпадіння більше трьох обєктів
    private checkColumns(): TСoordinates {
        let coordY: number[] = [];
        let coordX: number[] = [];
        for (let x = 0; x < this._playField[0].length; x++) {
            for (let y = 1; y < this._playField.length - 1; y++) {
                if (this._playField[y][x].typeBlock == this._playField[y - 1][x].typeBlock &&
                    this._playField[y][x].typeBlock == this._playField[y + 1][x].typeBlock) {
                    coordY.push(y);
                    coordX.push(x);
                    coordY.push(y - 1);
                    coordX.push(x);
                    coordY.push(y + 1);
                    coordX.push(x);
                }
            }
        }
        return {
            coordY,
            coordX
        }
    }
}

