import { IStylesObject } from './IStylesObject';
import { IParsedStyles, MediaObject } from './IParseStyles';
import { IFlatStylesObject } from './IFlatStylesObject';

export interface IStylesheet<S extends IStylesObject> {
    styles: IParsedStyles;
    stylesClassesMapping: Record<keyof S, string>;
    parsedStyles: IFlatStylesObject;
    media: MediaObject

    hasMedia(): boolean
    destroy(): void;
}
