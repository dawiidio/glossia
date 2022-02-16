import type { IVariant } from '../../../types/IVariant';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import type { IStylesObject } from '../../../types/IStylesObject';

export interface GetVariantObjectArgs {
    variant: IVariant;
    propertyName?: string;
    variantName?: string;
    propertyAdapter: IPropertyAdapter;
}

export function getVariantStylesObject({
                                           variant,
                                           propertyName = variant.property?.name,
                                           propertyAdapter,
                                           variantName = '',
                                       }: GetVariantObjectArgs): IStylesObject {
    let val: string;

    if (!variant.property) {
        val = variant.value;
    } else if (variant.property?.name === propertyName) {
        val = variant.value;
    } else {
        val = propertyAdapter.getNativePropertyGetter(`${variant.property.name}-${variant.property.getVariantName(variant)}`);
    }

    return {
        [propertyAdapter.getNativePropertyName(`${propertyName}${variantName ? '-' + variantName : ''}`)]: val,
    };
}
