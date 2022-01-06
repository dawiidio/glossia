import { stylesheetFactory } from '../Styles/stylesheetFactory';
import type { IStylesObject } from '../../types/IStylesObject';
import { ruleInterceptorFactory } from '../Styles/ruleInterceptorFactory';
import type { IStyles } from '../../types/IStyles';
import type { IStylesheet } from '../../types/IStylesheet';

export class Styles<S extends IStylesObject> implements IStyles<S> {
    readonly stylesheet: IStylesheet<S>;

    constructor(readonly styles: S, readonly namespace: string, prerenderedClasses?: Record<keyof S, string>) {
        this.stylesheet = stylesheetFactory<S>({
            stylesObject: styles,
            ruleInterceptor: ruleInterceptorFactory(namespace),
            prerenderedClasses
        });
    }
}
