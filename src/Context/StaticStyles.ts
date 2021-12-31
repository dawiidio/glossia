import { Stylesheet } from '../Styles/Stylesheet';
import { IStylesObject } from '../Styles/IStylesObject';
import { ruleInterceptorFactory } from '../Styles/ruleInterceptorFactory';

export class StaticStyles {
    public readonly stylesheet: Stylesheet<any>;

    constructor(public readonly styles: IStylesObject<any>, public readonly counterValue: number) {
        this.stylesheet = new Stylesheet<any>(styles, ruleInterceptorFactory(counterValue));
    }
}
