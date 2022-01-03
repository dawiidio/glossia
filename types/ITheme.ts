import { IVariant } from './IVariant';
import { IStylesObject } from './IStylesObject';

export interface ITheme {
    name: string
    variants: Map<string, IVariant>

    createThemeInitialCss(): IStylesObject
    getClassName(): string
}
