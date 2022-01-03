import { DEFAULT_RENDERER_OPTIONS, IRendererOptions } from '../../types/IRenderer';
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
}
