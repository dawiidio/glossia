import { IVariant } from './IVariant';
import { IStylesObject } from './IStylesObject';
import { IMediaVariant } from './IMediaVariant';
import { IPropertyAdapter } from './IPropertyAdapter';

export interface ITheme {
    name: string
    variants: Map<string, IVariant | IMediaVariant>

    createThemeInitialCss(propertyAdapter: IPropertyAdapter): IStylesObject
    getClassName(): string
}
