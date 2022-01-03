import { IParsedStyles } from '../../types/IParseStyles';
import { IStylesObject } from '../../types/IStylesObject';
import { IFlatStylesObject } from '../../types/IFlatStylesObject';
import { IRuleInterceptor } from '../../types/IRuleInterceptor';
import { parseStylesObject } from './parseStylesObject';
import { fixMediaRules } from '../common';
import { IStylesheet } from '../../types/IStylesheet';

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
