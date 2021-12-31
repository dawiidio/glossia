import { ITheme } from './ITheme';
import { IVariant } from './Variant/IVariant';
import { IStylesObject } from '../Styles/IStylesObject';
import { IFlatStylesObject } from '../Styles/IFlatStylesObject';
import { IStaticStyles } from '../Styles/IStaticStyles';

export class Theme implements ITheme {
    constructor(
        public name: string,
        public variants: Map<string, IVariant>
    ) {}

    createThemeInitialCss(): IStylesObject {
        const variables: IFlatStylesObject = {};
        const mediaRules: IStaticStyles = {};

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

                mediaRules[key][`--${variant.property.name}`] = variant.value;
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
