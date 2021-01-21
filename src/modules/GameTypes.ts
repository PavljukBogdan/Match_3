export type TGameObject = {
    numberBlock: number;
    typeBlock: number;
    x: number;
    y: number;
    alpha: number
}

export type TGameStateModel = {
    playField:TGameObject[][];
    removeBlock: number[];
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

