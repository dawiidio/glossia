import { IProperty } from './IProperty';
import { IDefaultVariant } from '../Variant/IVariantsMap';
import { IFlatStylesObject } from '../../Styles/IFlatStylesObject';
import { IPropertyAdapter } from './IPropertyAdapter';

export class Property<T extends IDefaultVariant> implements IProperty<T> {
    constructor(
        public readonly name: string,
        public readonly variants: T,
    ) {
        Object.values(this.variants).forEach(v => {
            if (!v.property)
                v.property = this;
        });
    }

    toDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject {
        return {
            [propertyAdapter.getNativePropertyName(this.name)]: this.variants.default.value,
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

    toString() {
        // todo toString() method is used in parseStylesObject on static styles when we have no access
        // to context, unfortunately it breaks propertyAdapter pattern as it is so in future should be changed
        return `var(--${this.name})`;
    }
}
