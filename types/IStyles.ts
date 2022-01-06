import { IStylesObject } from './IStylesObject';
import { IStylesheet } from './IStylesheet';

export interface IStyles<S extends IStylesObject> {
    stylesheet: IStylesheet<S>;
    readonly styles: S;
    readonly namespace: number|string;
}
