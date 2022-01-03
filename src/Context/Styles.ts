import { Stylesheet } from '../Styles/Stylesheet';
import { IStylesObject } from '../../types/IStylesObject';
import { ruleInterceptorFactory } from '../Styles/ruleInterceptorFactory';
import { IStyles } from '../../types/IStyles';

export class Styles<S extends IStylesObject> implements IStyles<S> {
    readonly stylesheet: Stylesheet<S>;

    constructor(readonly styles: S, readonly counterValue: number) {
        this.stylesheet = new Stylesheet<S>(styles, ruleInterceptorFactory(counterValue));
    }
}
