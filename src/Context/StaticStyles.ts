import { Stylesheet } from '../Styles/Stylesheet';
import { IStylesObject } from '../Styles/IStylesObject';
import { ruleInterceptorFactory } from '../Styles/ruleInterceptorFactory';

export class StaticStyles {
    readonly stylesheet: Stylesheet<any>;

    constructor(readonly styles: IStylesObject<any>, readonly counterValue: number) {
        this.stylesheet = new Stylesheet<any>(styles, ruleInterceptorFactory(counterValue));
    }
}
