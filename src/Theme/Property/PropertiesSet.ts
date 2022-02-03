import type { IProperty } from '../../../types/IProperty';
import type { IFlatStylesObject } from '../../../types/IFlatStylesObject';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import { IVariant } from '../../../types/IVariant';
import { IVariantsMap } from '../../../types/IVariantsMap';
import { IMediaVariantVariant } from '../../../types/IMediaVariant';
import { isMediaVariant, isVariant } from '../../common';

export class PropertiesSet<T extends IVariantsMap> implements IProperty<T> {
    private variantToNameMapping = new WeakMap<IVariant|IMediaVariantVariant, string>();

    constructor(
        public readonly name: string,
        public readonly variants: T,
    ) {
        Object.entries(this.variants).forEach(([name, variant]) => {
            if (!variant.property)
                variant.property = this;

            this.variantToNameMapping.set(variant, name);
        });
    }

    toDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject {
        return {};
    }

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject {
        return Object.entries(this.variants).reduce((acc, [variantName, variant]) => {
            let val: string;

            if (variant.property?.name === this.name) {
                if (isMediaVariant(variant)) {
                    val = ''
                }
                else if (isVariant(variant)) {
                    val = variant.value;
                }
                else {
                    throw new Error(`Unknown variant type`);
                }
            } else {
                if (!variant.property)
                    throw new Error('Variant must point to its property');

                val = propertyAdapter.getNativePropertyGetter(`${variant.property.name}-${variantName}`);
            }

            return {
                ...acc,
                [propertyAdapter.getNativePropertyName(`${this.name}-${variantName}`)]: val,
            };
        }, {});
    }

    getVariantName(variant: IVariant): string {
        if (!this.variantToNameMapping.has(variant))
            throw new Error(`Property ${this.name} have no such variant as passed`);

        return this.variantToNameMapping.get(variant) as string;
    }

    toString() {
        throw new Error(`PropertiesSet can not be accessed by reference`);
    }
}
