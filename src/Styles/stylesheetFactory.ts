import type { IRuleInterceptor } from '../../types/IRuleInterceptor';
import type { IStylesObject } from '../../types/IStylesObject';
import { Stylesheet } from './Stylesheet';
import { TemplateStylesheet } from './TemplateStylesheet';

export interface IStylesheetFactory<S> {
    stylesObject: S,
    ruleInterceptor?: IRuleInterceptor,
    prerenderedClasses?: Record<keyof S, string>
    disableStylesParsing?: boolean
    type?: 'template' | 'regular'
}

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
        case 'template':
            return new TemplateStylesheet(
                stylesObject,
                ruleInterceptor,
                disableStylesParsing,
            );
    }
}
