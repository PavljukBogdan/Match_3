import Model from "./model";
import View from "./view";
import {TGameStateView, TInfoBlock} from "./GameTypes";
import {GameState} from "./gameEnums";


export default class Controller {
    //------------------- variables ---------------------//
    private _model: Model;
    private _view: View;
    private _blockOne: TInfoBlock;
    private _blockTwo: TInfoBlock;
    private _gameState = GameState.inGame;

    constructor(model: Model, view: View) {
        this._model = model;
        this._view = view;

        document.addEventListener('mousedown',this.handleMouseDown.bind(this));

    }
    //------------------- gameEvents ---------------------//
    //намагаємось перемістити блоки
    private tryMoveBlock(state: TGameStateView): void {
        const infoBlock = state.infoBlock;
        if (infoBlock.length % 2 == 0) {
            this._blockOne = infoBlock[infoBlock.length - 2];
            this._blockTwo = infoBlock[infoBlock.length - 1];
            if (this.checkWhetherAdjacentBlocks(this._blockOne,this._blockTwo)) {
                this._model.moveBlocks(this._blockOne, this._blockTwo);
                this._model.gameCheckField();
                this._view.updateSprite();
                this._view.updateAlpha();
            }
        }
        while (this._model.checkAssembledLines()) {
            this._model.gameCheckField();
            this._view.updateSprite();
            this._view.updateAlpha();
        }
        if (this._model.getStateModel().numberTaskBlock <= 0) {
            this._gameState = GameState.gameOver;
        }
        this._view.updateTextScreen(this._model.getStateModel().numberTaskBlock);
        this._view.renderMainScreen();
    }
    //перевірка чи блоки сусідні
    private checkWhetherAdjacentBlocks(blockOne: TInfoBlock, blockTwo: TInfoBlock): boolean {
        if(blockOne.x == blockTwo.x || blockOne.y == blockTwo.y) {
            if(Math.abs(blockOne.x - blockTwo.x) == this._view.gameStateView().HEIGHT_GAME_BLOCK + 2 ||
                Math.abs(blockOne.y - blockTwo.y) == this._view.gameStateView().WIDTH_GAME_BLOCK + 2) {
                return true;
            }
        }
        return false;
    }
    //------------------- keyboardEvent ---------------------//
    //слідкуємо за натисканням клавіш
    private handleMouseDown(e: MouseEvent): void {
        if (this._gameState == GameState.inGame) {
            this.tryMoveBlock(this._view.gameStateView());
        }
    }
}