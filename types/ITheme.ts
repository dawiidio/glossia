import { IVariant } from './IVariant';
import { IStylesObject } from './IStylesObject';
import { IMediaVariantVariant } from './IMediaVariant';
import { IPropertyAdapter } from './IPropertyAdapter';

export interface ITheme {
    name: string
    variants: Map<string, IVariant | IMediaVariantVariant>

    createThemeInitialCss(propertyAdapter: IPropertyAdapter): IStylesObject
    getClassName(): string
}
