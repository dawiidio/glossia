import { IVariantsMap } from '../Variant/IVariantsMap';

export interface IBaseProperty<T extends IVariantsMap> {
    name: string
    variants: T
}
