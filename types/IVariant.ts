import type { IProperty } from './IProperty';
import { IBaseVariant } from './IBaseVariant';

export interface IVariant extends IBaseVariant {
    property?: IProperty<any>
    value: string

    getKeyId(): string
}
