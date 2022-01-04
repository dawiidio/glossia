import { IRendererOptions } from '../../types/IRenderer';
import { Renderer } from './Renderer';
import { DEFAULT_RENDERER_OPTIONS } from './defaultRendererOptions';

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
}
