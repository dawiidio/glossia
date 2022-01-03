export interface ICounter {
    children: ICounter[];
    destroyed: boolean;
    parent?: ICounter;
    value: number;

    increase(): number;

    getCount(): number;

    destroy(): void;

    detachChildren(): void;

    spawn(): ICounter;
}
