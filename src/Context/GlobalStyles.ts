import { stylesheetFactory } from '../Styles/stylesheetFactory';
import type { IStylesObject } from '../../types/IStylesObject';
import type { IStyles } from '../../types/IStyles';
import type { IStylesheet } from '../../types/IStylesheet';

export class GlobalStyles<S extends IStylesObject> implements IStyles<S> {
    readonly stylesheet: IStylesheet<S>;

    constructor(readonly styles: S, readonly namespace: string) {
        this.stylesheet = stylesheetFactory<S>({
            stylesObject: styles,
            type: 'global'
        });
    }
}
