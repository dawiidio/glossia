import { IVariant } from './IVariant';

export type IVariantsMap = Record<string, IVariant>;

export interface IDefaultVariant extends IVariantsMap {
    default: IVariant
}
