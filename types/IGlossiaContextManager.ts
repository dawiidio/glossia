import type { IProperty } from './IProperty';
import type { ITheme } from './ITheme';
import type { IVirtualProperty } from './IVirtualProperty';
import type { IRenderMode } from './IRenderMode';

export interface ICreateContext {
    properties?: Array<IProperty<any> | IVirtualProperty<any>>;
    themes?: ITheme[];
    mode?: IRenderMode
    prerenderedData?: Record<string, Record<string, string>>
}
