import { IVariantsMap } from './IVariantsMap';

export interface IBaseProperty<T extends IVariantsMap> {
    name: string
    variants: T
}
