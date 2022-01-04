import { IFlatStylesObject } from './IFlatStylesObject';

export interface IRendererOptions {
    elementId: string
    attributes?: Record<string, string>
}

export interface IRenderer {
    render(styles: IFlatStylesObject): void
    clean(styles: IFlatStylesObject): void
    toString(): string
    destroy(): void
}
