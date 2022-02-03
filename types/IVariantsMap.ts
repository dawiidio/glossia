import { IVariant } from './IVariant';
import { IMediaVariantVariant } from './IMediaVariant';

export type IVariantsMap = Record<string, IVariant | IMediaVariantVariant>;

export interface IDefaultVariant extends IVariantsMap {
    default: IVariant | IMediaVariantVariant;
}

