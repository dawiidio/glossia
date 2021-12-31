import { IFlatStylesObject } from '../Styles/IFlatStylesObject';

export interface IRendererOptions {
    elementId: string
    attributes?: Record<string, string>
}

export const DEFAULT_RENDERER_OPTIONS: Partial<IRendererOptions> = {
    attributes: {},
};

export interface IRenderer {
    render(styles: IFlatStylesObject): void
    clean(styles: IFlatStylesObject): void
    toString(): string
    destroy(): void
}
