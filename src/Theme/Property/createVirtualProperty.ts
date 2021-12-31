import { VirtualProperty } from '../Variant/VirtualProperty';
import { IVirtualProperty } from './IVirtualProperty';
import { IVariantsMap } from '../Variant/IVariantsMap';

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T> {
    return new VirtualProperty<T>(name, variants);
}
