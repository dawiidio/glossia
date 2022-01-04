import type { IRenderer, IRendererOptions } from '../../types/IRenderer';
import { DomRenderer } from './DomRenderer';
import { StringRenderer } from './StringRenderer';

export interface IRendererFactoryOptions extends IRendererOptions {
    ssr?: boolean;
}

let domRenderer: IRenderer;

export function rendererFactory(options: IRendererFactoryOptions): IRenderer {
    if (options.ssr) {
        return new StringRenderer(options);
    }

    if (!domRenderer) {
        domRenderer = new DomRenderer(options);
    }

    return domRenderer;
}
