import type { IProperty } from '../../../types/IProperty';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import { camelToKebabCase, isMediaVariant, isVariant } from '../../common';
import { IVariant } from '../../../types/IVariant';
import { IMediaVariantVariant } from '../../../types/IMediaVariant';
import { IStylesObject } from '../../../types/IStylesObject';
import { getVariantStylesObject } from '../Variant/common';
import { IVariantsMap } from '../../../types/IVariantsMap';

export class BaseProperty<T extends IVariantsMap> implements IProperty<T> {
    private variantToNameMapping = new WeakMap<IVariant | IMediaVariantVariant, string>();

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

    toDefinitionObject(propertyAdapter: IPropertyAdapter): IStylesObject {
        return {
            [propertyAdapter.getNativePropertyName(this.name)]: propertyAdapter.getNativePropertyGetter(`${camelToKebabCase(this.name)}-default`),
        };
    }

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IStylesObject {
        return Object.entries(this.variants).reduce<IStylesObject>((acc, [variantName, variant]) => {
            let val: string;

            if (variant.property?.name === this.name) {
                if (isMediaVariant(variant)) {
                    const mediaVars = Object.entries(variant.mediaQueries).reduce<IStylesObject>((acc2, [key, val2]) => {
                        if (isMediaVariant(val2))
                            throw new Error(`Media variant can not be nested`);

                        if (key === 'default')
                            return acc2;

                        return {
                            ...acc2,
                            [`@media ${key}`]: {
                                ...((acc[`@media ${key}`] as {}) || {}),
                                ...getVariantStylesObject({
                                    variant: val2 as IVariant,
                                    variantName,
                                    propertyName: this.name,
                                    propertyAdapter,
                                }),
                            },
                        };
                    }, {});

                    return {
                        ...acc,
                        ...getVariantStylesObject({
                            variant: variant.mediaQueries.default as IVariant,
                            variantName,
                            propertyName: this.name,
                            propertyAdapter,
                        }),
                        ...mediaVars,
                    };
                } else if (isVariant(variant)) {
                    val = variant.value;
                } else {
                    throw new Error(`Unknown variant type`);
                }
            } else {
                if (!variant.property)
                    throw new Error('Variant must point to its property');

                val = propertyAdapter.getNativePropertyGetter(`${variant.property.name}-${variant.property.getVariantName(variant)}`);
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
