import type { IFlatStylesObject } from '../../types/IFlatStylesObject';
import type { IRendererOptions } from '../../types/IRenderer';
import { Renderer } from './Renderer';
import { DEFAULT_RENDERER_OPTIONS } from './defaultRendererOptions';

export class DomRenderer extends Renderer {
    static createStyleElement(): HTMLStyleElement {
        return document.createElement('style');
    }

    private element: HTMLStyleElement|null = DomRenderer.createStyleElement();
    private attached: boolean = false;
    private rulesMap = new Map<string, CSSRule>();
    private readonly options: IRendererOptions;

    constructor(
        options: IRendererOptions
    ) {
        super();
        this.options = {
            ...DEFAULT_RENDERER_OPTIONS,
            ...options
        };

        if (this.element)
            this.element.id = this.options.elementId;
    }

    render(styles: IFlatStylesObject) {
        if (!this.attached)
            this.attach();

        Object
            .entries(styles)
            .forEach(([selector, styles]) => this.renderRule(selector, styles));

        super.render(styles);
    }

    clean(styles: IFlatStylesObject) {
        if (!this.attached)
            return;

        Object
            .keys(styles)
            .forEach((selector) => this.removeRule(selector));

        super.clean(styles);
    }

    attach() {
        if (!this.element)
            throw new Error(`Element destroyed`);

        document.head.appendChild(this.element);
        this.attached = true;
    }

    detach() {
        if (!this.element)
            throw new Error(`Element destroyed`);

        document.head.removeChild(this.element);
        this.element = null;
        this.attached = false;
    }

    private findRuleIdx(nativeRule: CSSRule) {
        if (!this.element)
            throw new Error(`Element destroyed`);

        if (!this.element.sheet)
            throw new Error('');

        const rules = this.element.sheet.cssRules;

        for (let i = 0; i < rules.length; ++i) {
            if (rules[i] === nativeRule) return i;
        }

        return -1;
    }

    private renderRule(rule: string, styles: string): number {
        if (!this.element)
            throw new Error(`Element destroyed`);

        if (!this.element.sheet)
            throw new Error('');

        const {
            cssRules,
        } = this.element.sheet;

        this.removeRule(rule);

        const idx = this.element.sheet.insertRule(rule + styles, cssRules.length);

        this.rulesMap.set(rule, cssRules[idx]);

        return idx;
    }

    private removeRule(rule: string): number {
        if (!this.element)
            throw new Error(`Element destroyed`);

        if (!this.element.sheet)
            throw new Error('Element have no stylesheet');

        if (this.rulesMap.has(rule)) {
            const nativeRule = this.rulesMap.get(rule) as CSSRule;
            const idx = this.findRuleIdx(nativeRule);

            if (idx >= 0)
                this.element.sheet.deleteRule(idx);

            return idx;
        }

        return -1;
    }

    destroy() {
        this.rulesMap.clear();
        this.detach();

        super.destroy();
    }
}
