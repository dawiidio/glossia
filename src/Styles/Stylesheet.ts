import type { IParsedStyles } from '../../types/IParseStyles';
import type { IStylesObject } from '../../types/IStylesObject';
import type { IFlatStylesObject } from '../../types/IFlatStylesObject';
import type { IRuleInterceptor } from '../../types/IRuleInterceptor';
import type { IStylesheet } from '../../types/IStylesheet';
import { parseStylesObject } from './parseStylesObject';
import { fixMediaRules } from '../common';

export class Stylesheet<S extends IStylesObject> implements IStylesheet<S> {
    styles: IParsedStyles = {};
    stylesClassesMapping: Record<keyof S, string>;
    parsedStyles: IFlatStylesObject = {};

    constructor(stylesObject: S, ruleInterceptor?: IRuleInterceptor) {
        const {
            styles, stylesClassesMapping,
        } = parseStylesObject<S>({
            styles: stylesObject,
            ruleInterceptor,
        });

        this.styles = styles;
        this.stylesClassesMapping = stylesClassesMapping;
        this.parsedStyles = fixMediaRules(this.styles);
    }

    destroy() {
        this.styles = {};
        this.parsedStyles = {};
    }
}
