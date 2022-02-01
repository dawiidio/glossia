import { IVariantsMap } from './IVariantsMap';
import { IBaseProperty } from './IBaseProperty';

// todo remove support for virtual properties
export interface IVirtualProperty<T extends IVariantsMap> extends IBaseProperty<T> {}
