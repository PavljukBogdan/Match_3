export type TGameObject = {
    typeBlock: number;
    x: number;
    y: number;
}

export type TGameState = {
    playField:TGameObject[][]
}