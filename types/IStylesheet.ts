import { IStylesObject } from './IStylesObject';
import { IParsedStyles } from './IParseStyles';
import { IFlatStylesObject } from './IFlatStylesObject';

export interface IStylesheet<S extends IStylesObject> {
    styles: IParsedStyles;
    stylesClassesMapping: Record<keyof S, string>;
    parsedStyles: IFlatStylesObject;

    destroy(): void;
}
