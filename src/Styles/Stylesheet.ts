import type { IParsedStyles, MediaObject } from '../../types/IParseStyles';
import type { IStylesObject } from '../../types/IStylesObject';
import type { IFlatStylesObject } from '../../types/IFlatStylesObject';
import type { IRuleInterceptor } from '../../types/IRuleInterceptor';
import type { IStylesheet } from '../../types/IStylesheet';
import { parseStylesObject } from './parseStylesObject';
import { fixMediaRules } from '../common';

export class Stylesheet<S extends IStylesObject> implements IStylesheet<S> {
    styles: IParsedStyles = {};
    media: MediaObject = {};
    stylesClassesMapping: Record<keyof S, string>;
    parsedStyles: IFlatStylesObject = {};

    constructor(stylesObject: S, ruleInterceptor: IRuleInterceptor = (val) => val, prerenderedClasses?: Record<keyof S, string>) {
        if (prerenderedClasses) {
            this.stylesClassesMapping = prerenderedClasses;
        } else {
            const {
                styles, stylesClassesMapping, media
            } = parseStylesObject<S>({
                styles: stylesObject,
                ruleInterceptor,
            });

            this.styles = styles;
            this.media = media;
            this.stylesClassesMapping = stylesClassesMapping;
            this.parsedStyles = fixMediaRules(this.styles);
        }
    }

    hasMedia(): boolean {
        return Object.keys(this.media).length > 0;
    }

    destroy() {
        this.styles = {};
        this.parsedStyles = {};
        this.media = {};
    }
}
