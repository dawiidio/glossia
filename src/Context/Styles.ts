import { Stylesheet } from '../Styles/Stylesheet';
import type { IStylesObject } from '../../types/IStylesObject';
import { ruleInterceptorFactory } from '../Styles/ruleInterceptorFactory';
import type { IStyles } from '../../types/IStyles';

export class Styles<S extends IStylesObject> implements IStyles<S> {
    readonly stylesheet: Stylesheet<S>;

    constructor(readonly styles: S, readonly id: string) {
        this.stylesheet = new Stylesheet<S>(styles, ruleInterceptorFactory(id));
    }
}
