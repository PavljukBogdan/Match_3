export type TGameObject = {
    typeBlock: number;
    x: number;
    y: number;
    alpha: number
}

export type TGameStateModel = {
    playField:TGameObject[][];
}

export type TGameStateView = {
    gameBlockSprite: PIXI.Sprite[][];
    infoBlock: TInfoBlock[];
}

export type TInfoBlock = {
    name: string;
    x: number;
    y: number;
}