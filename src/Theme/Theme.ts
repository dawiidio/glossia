import type { ITheme } from '../../types/ITheme';
import type { IVariant } from '../../types/IVariant';
import type { IStylesObject } from '../../types/IStylesObject';
import { isMediaVariant, isVariant } from '../common';
import { IMediaVariantVariant } from '../../types/IMediaVariant';
import { IPropertyAdapter } from '../../types/IPropertyAdapter';
import { getVariantStylesObject } from './Variant/common';

function renderVariants(variants: Array<IVariant | IMediaVariantVariant>, propertyAdapter: IPropertyAdapter): IStylesObject {
    return variants.reduce<IStylesObject>((acc, variant) => {
        let val: string;

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
                            propertyName: variant.property?.name,
                            propertyAdapter,
                        }),
                    },
                };
            }, {});

            return {
                ...acc,
                ...getVariantStylesObject({
                    variant: variant.mediaQueries.default as IVariant,
                    propertyAdapter,
                    propertyName: variant.property?.name,
                }),
                ...mediaVars,
            };
        } else if (isVariant(variant)) {
            val = variant.value;
        } else {
            throw new Error(`Unknown variant type`);
        }

        return {
            ...acc,
            [propertyAdapter.getNativePropertyName(`${variant.property?.name}`)]: val,
        };
    }, {});
}

export class Theme implements ITheme {
    constructor(
        public name: string,
        public variants: Map<string, IVariant | IMediaVariantVariant>,
    ) {}

    createThemeInitialCss(propertyAdapter: IPropertyAdapter): IStylesObject {
        return {
            [this.getClassName()]: renderVariants([...this.variants.values()], propertyAdapter)
        }
    }

    getClassName(): string {
        return `theme-${this.name}`;
    }
}
