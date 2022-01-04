import type { ITheme } from '../../types/ITheme';
import type { IVariant } from '../../types/IVariant';
import type { IStylesObject } from '../../types/IStylesObject';
import type { IFlatStylesObject } from '../../types/IFlatStylesObject';
import type { IParsedStyles } from '../../types/IParseStyles';
import { isRecord } from '../common';

export class Theme implements ITheme {
    constructor(
        public name: string,
        public variants: Map<string, IVariant>,
    ) {
    }

    createThemeInitialCss(): IStylesObject {
        const variables: IFlatStylesObject = {};
        const mediaRules: IParsedStyles = {};

        for (const [propertyName, variant] of this.variants.entries()) {
            if (!variant.property)
                throw new Error('Variant must point to its property');

            if (!variant.mediaQuery) {
                variables[`--${propertyName}`] = variant.value;
                continue;
            }

            if (variant.mediaQuery) {
                const key = `@media ${variant.mediaQuery}`;
                if (!mediaRules[key])
                    mediaRules[key] = {};

                const temp = mediaRules[key];

                if (isRecord(temp))
                    temp[`--${variant.property.name}`] = variant.value;
            }
        }

        return {
            [this.getClassName()]: {
                ...variables,
                ...mediaRules,
            },
        };
    }

    getClassName(): string {
        return `theme-${this.name}`;
    }
}
