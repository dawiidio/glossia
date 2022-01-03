import { IVariantsMap } from '../../../types/IVariantsMap';
import { IVirtualProperty } from '../../../types/IVirtualProperty';

export class VirtualProperty<T extends IVariantsMap = IVariantsMap> implements IVirtualProperty<T> {
    constructor(
        public readonly name: string,
        public readonly variants: T,
    ) {
        Object.values(this.variants).forEach(v => {
            v.property = this;
        });
    }
}
