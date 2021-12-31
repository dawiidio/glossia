import { DEFAULT_RENDERER_OPTIONS, IRendererOptions } from './IRenderer';
import { Renderer } from './Renderer';

export class StringRenderer extends Renderer {
    private readonly options: IRendererOptions;

    constructor(
        options: IRendererOptions
    ) {
        super();

        this.options = {
            ...DEFAULT_RENDERER_OPTIONS,
            ...options
        }
    }

    toString(): string {
        const attrs = Object
            .entries(this.options.attributes || {})
            .reduce((acc, [key, value]) => `${acc} data-${key}="${value}"`, ' ');

        return `<style id="${this.options.elementId || 'ssr-styles'}"${attrs}>${super.toString()}</style>`;
    }
}
