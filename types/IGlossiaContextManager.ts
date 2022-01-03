import { IProperty } from './IProperty';
import { ITheme } from './ITheme';
import { IVirtualProperty } from './IVirtualProperty';

export interface ICreateContext {
    ssr?: boolean;
    properties?: Array<IProperty<any> | IVirtualProperty<any>>;
    themes?: ITheme[];
}
