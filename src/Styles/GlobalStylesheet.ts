import type { IParsedStyles } from '../../types/IParseStyles';
import type { IStylesObject } from '../../types/IStylesObject';
import type { IFlatStylesObject } from '../../types/IFlatStylesObject';
import type { IRuleInterceptor } from '../../types/IRuleInterceptor';
import type { IStylesheet } from '../../types/IStylesheet';
import { parseStylesObject } from './parseStylesObject';
import { fixMediaRules } from '../common';
import { MediaObject } from '../../types/IParseStyles';

export class GlobalStylesheet<S extends IStylesObject = any> implements IStylesheet<S> {
    styles: IParsedStyles = {};
    stylesClassesMapping: Record<keyof S, string>;
    parsedStyles: IFlatStylesObject = {};
    media: MediaObject = {};

    constructor(stylesObject: S, ruleInterceptor: IRuleInterceptor = (val) => val, disableStylesParsing?: boolean) {
        if (disableStylesParsing) {
            this.stylesClassesMapping = {} as Record<keyof S, string>;
        } else {
            const {
                styles, stylesClassesMapping, media
            } = parseStylesObject<S>({
                styles: stylesObject,
                ruleInterceptor,
                global: true
            });

            this.media = media;
            this.styles = styles;
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
    }
}
