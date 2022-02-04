import { IVariant } from './IVariant';
import { IMediaVariant } from './IMediaVariant';

export type IVariantsMap = Record<string, IVariant | IMediaVariant>;

export interface IDefaultVariant extends IVariantsMap {
    default: IVariant | IMediaVariant;
}

