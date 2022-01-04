import { VirtualProperty } from '../Variant/VirtualProperty';
import type { IVirtualProperty } from '../../../types/IVirtualProperty';
import type { IVariantsMap } from '../../../types/IVariantsMap';

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T> {
    return new VirtualProperty<T>(name, variants);
}
