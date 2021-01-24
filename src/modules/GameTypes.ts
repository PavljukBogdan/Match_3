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

