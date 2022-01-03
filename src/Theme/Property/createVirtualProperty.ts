import { VirtualProperty } from '../Variant/VirtualProperty';
import { IVirtualProperty } from '../../../types/IVirtualProperty';
import { IVariantsMap } from '../../../types/IVariantsMap';

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T> {
    return new VirtualProperty<T>(name, variants);
}
