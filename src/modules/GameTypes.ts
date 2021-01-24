export type TGameObject = {
    numberBlock: number;
    numberType: number;
    typeBlock: string;
    x: number;
    y: number;
    alpha: number
}

export type TGameStateModel = {
    gameBlock: TGameObject[];
    playField: TGameObject[][];
    newGameBlock: TGameObject[]
    removeBlockNumber: TGameObject[];
    taskBlock: TGameObject;
    numberTaskBlock: number;
}

export type TGameStateView = {
    gameBlockSprite: PIXI.Sprite[];
    infoBlock: TInfoBlock[];
    WIDTH_GAME_BLOCK: number; //ширина ігрового блоку
    HEIGHT_GAME_BLOCK: number; //висота ігрового блоку
}

export type TInfoBlock = {
    name: string;
    x: number;
    y: number;
}

export type TСoordinates = {
    coordY: number[],
    coordX: number[],
}

