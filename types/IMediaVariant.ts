import type { IProperty } from './IProperty';
import { IBaseVariant } from './IBaseVariant';
import { IDefaultVariant } from './IVariantsMap';

export interface IMediaVariantVariant extends IBaseVariant {
    property?: IProperty<any>
    mediaQueries: IDefaultVariant
}
