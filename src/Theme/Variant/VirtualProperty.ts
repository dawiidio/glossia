import type { IVariantsMap } from '../../../types/IVariantsMap';
import type { IProperty } from '../../../types/IProperty';
import type { IVariant } from '../../../types/IVariant';
import type { IFlatStylesObject } from '../../../types/IFlatStylesObject';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';

export class VirtualProperty<T extends IVariantsMap = IVariantsMap> implements IProperty<T> {
    constructor(
        public readonly name: string,
        public readonly variants: T,
    ) {
        Object.values(this.variants).forEach(v => {
            v.property = this;
        });
    }

    getVariantName(variant: IVariant): string {
        return '';
    }

    toDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject {
        return {};
    }

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject {
        return {};
    }
}
