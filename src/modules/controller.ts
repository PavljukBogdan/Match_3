import Model from "./model";
import View from "./view";
import {TGameStateView, TInfoBlock} from "./GameTypes";



export default class Controller {

    private _model: Model;
    private _view: View;

    constructor(model: Model, view: View) {
        this._model = model;
        this._view = view;

        document.addEventListener('mousedown',this.handleMouseDown.bind(this));
    }
    //намагаємось перемістити блоки
    private tryMoveBlock(state: TGameStateView) {
        const infoBlock = state.infoBlock;
        if (infoBlock.length % 2 == 0) {
            if (this.checkWhetherAdjacentBlocks(infoBlock[infoBlock.length - 2],infoBlock[infoBlock.length - 1])) {
                this._model.moveBlocks(this._view.gameStateView().gameBlockSprite,infoBlock[infoBlock.length - 2],infoBlock[infoBlock.length - 1]);
                 // console.log('oneBlock-' + infoBlock[infoBlock.length - 2].name);
                 // console.log('twoBlock-' + infoBlock[infoBlock.length - 1].name);
                this._model.checkStringsSprite(this._view.gameStateView().gameBlockSprite);
            } else {
                console.log(false);
            }
        }
    }
    //перевірка чи блоки сусідні
    private checkWhetherAdjacentBlocks(blockOne: TInfoBlock, blockTwo: TInfoBlock): boolean {
        if(blockOne.x == blockTwo.x || blockOne.y == blockTwo.y) {
            if(Math.abs(blockOne.x - blockTwo.x) == 68 || Math.abs(blockOne.y - blockTwo.y) == 68) {
                return true;
            }
        }
        return false;
    }

    //------------------- keyboardEvent ---------------------//
    //слідкуємо за натисканням клавіш
    private handleMouseDown(e: MouseEvent): void {
        this.tryMoveBlock(this._view.gameStateView());
    }
}