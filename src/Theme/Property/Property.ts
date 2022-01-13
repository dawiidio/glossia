import type { IProperty } from '../../../types/IProperty';
import type { IDefaultVariant } from '../../../types/IVariantsMap';
import type { IFlatStylesObject } from '../../../types/IFlatStylesObject';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import { camelToKebabCase } from '../../common';
import { IVariant } from '../../../types/IVariant';

export class Property<T extends IDefaultVariant> implements IProperty<T> {
    private variantToNameMapping = new WeakMap<IVariant, string>();

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
        return {
            [propertyAdapter.getNativePropertyName(this.name)]: propertyAdapter.getNativePropertyGetter(`${camelToKebabCase(this.name)}-default`),
        };
    }

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject {
        return Object.entries(this.variants).reduce((acc, [variantName, variant]) => {
            let val: string;

            if (variant.property?.name === this.name) {
                val = variant.value;
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
        // todo toString() method is used in parseStylesObject on static styles when we have no access
        // to context, unfortunately it breaks propertyAdapter pattern as it is so in future should be changed
        return `var(--${this.name})`;
    }
}
