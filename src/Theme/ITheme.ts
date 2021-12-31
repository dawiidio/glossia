import { IVariant } from './Variant/IVariant';
import { IStylesObject } from '../Styles/IStylesObject';

export interface ITheme {
    name: string
    variants: Map<string, IVariant>

    createThemeInitialCss(): IStylesObject
    getClassName(): string
}
