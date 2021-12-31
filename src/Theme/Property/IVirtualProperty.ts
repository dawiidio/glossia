import { IVariantsMap } from '../Variant/IVariantsMap';
import { IBaseProperty } from './IBaseProperty';

export interface IVirtualProperty<T extends IVariantsMap> extends IBaseProperty<T> {}
