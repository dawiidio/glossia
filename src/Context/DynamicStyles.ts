import { IRuleInterceptor, IRuleInterceptorFactory } from '../Styles/IRuleInterceptor';
import { IRenderer } from '../Renderer/IRenderer';
import { StaticStyles } from './StaticStyles';

export class DynamicStyles {
    private readonly ruleInterceptor?: IRuleInterceptor;
    private lastRenderedStyles: Record<string, string> = {};
    public classesMapping: Record<string, string> = {};

    constructor(
        public parent: StaticStyles,
        public counterValue: number,
        public renderer: IRenderer,
        ruleInterceptorFactory: IRuleInterceptorFactory,
    ) {
        this.ruleInterceptor = ruleInterceptorFactory(this.parent.counterValue, this.counterValue);
    }

    render<T>(props: T) {
        const {
            classesMapping, parsedStyles,
        } = this.parent.stylesheet.parseDynamicStyles(props, this.ruleInterceptor);

        this.renderer.render(parsedStyles);

        this.lastRenderedStyles = parsedStyles;
        this.classesMapping = classesMapping;
    }

    clean() {
        this.renderer.clean(this.lastRenderedStyles);
    }
}
