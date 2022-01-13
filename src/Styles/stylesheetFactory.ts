import type { IRuleInterceptor } from '../../types/IRuleInterceptor';
import type { IStylesObject } from '../../types/IStylesObject';
import { Stylesheet } from './Stylesheet';
import { TemplateStylesheet } from './TemplateStylesheet';
import { GlobalStylesheet } from './GlobalStylesheet';

export interface IStylesheetFactory<S> {
    stylesObject: S,
    ruleInterceptor?: IRuleInterceptor,
    prerenderedClasses?: Record<keyof S, string>
    disableStylesParsing?: boolean
    type?: 'template' | 'regular' | 'global'
}

/**
 * regular - styles
 */
export function stylesheetFactory<S extends IStylesObject>({
                                                               prerenderedClasses,
                                                               stylesObject,
                                                               ruleInterceptor = (val) => val,
                                                               disableStylesParsing,
                                                               type = 'regular',
                                                           }: IStylesheetFactory<S>): Stylesheet<S> {
    switch (type) {
        case 'regular':
            return new Stylesheet<S>(
                stylesObject,
                ruleInterceptor,
                prerenderedClasses,
            );
        case 'template': // todo remove template type and use global instead
            return new TemplateStylesheet(
                stylesObject,
                ruleInterceptor,
                disableStylesParsing,
            );
        case 'global':
            return new GlobalStylesheet(
                stylesObject,
                ruleInterceptor,
                disableStylesParsing,
            );
    }
}
