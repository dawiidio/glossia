import { createProperty } from './Theme/Property/createProperty';
import { createMediaVariant } from './Theme/Variant/createMediaVariant';
import { createVariant } from './Theme/Variant/createVariant';
import { createPropertiesSet } from './Theme/Property/createPropertiesSet';
import { IProperty } from '../types/IProperty';
import { IVirtualProperty } from '../types/IVirtualProperty';
import { ITheme } from '../types/ITheme';
import { createTheme } from './Theme/createTheme';

export const breakpoints = {
    xl: '@media all and (min-width: 1200px)',
    l: '@media all and (min-width: 1200px)',
    m: '@media all and (min-width: 700px)',
    s: '@media all and (min-width: 400px)',
};

interface PropertiesAndThemes {
    properties: Array<IProperty<any> | IVirtualProperty<any>>;
    themes: ITheme[];
}

export function createTestPropertiesAndThemes(): PropertiesAndThemes {
    const bg = createProperty('background', {
        default: createMediaVariant({
            default: createVariant('pink'),
            [breakpoints.l]: createVariant('blue'),
        }),
    });

    const fontFamily = createPropertiesSet('font-family', {
        primary: createVariant(`'Nunito', sans-serif`),
        secondary: createVariant(`'Roboto Mono', monospace`),
    });

    const containerWidth = createProperty('container-width', {
        default: createMediaVariant({
            default: createVariant('100%'),
            [breakpoints.l]: createVariant('1000px'),
        }),
    });

    const palette = createPropertiesSet('palette', {
        accent: createVariant('#46A935'),
        dark: createVariant('#000'),
        buttonPrimary: createVariant('#000'),
        buttonSecondary: createVariant('#46A935'),
        buttonFilledText: createVariant('#FFF'),
        light: createVariant('#FFF'),
        textPrimary: createVariant('#000'),
        textSecondary: createVariant('#484848'),
        backgroundAccented: createVariant('#F8FFF6'),
        backgroundBase: createVariant('#FFF'),
    });

    const size = createPropertiesSet('size', {
        s: createVariant('2px'),
        sm: createVariant('4px'),
        m: createVariant('8px'),
        l: createVariant('16px'),
        xl: createVariant('32px'),
    });

    const fontSizes = createPropertiesSet('font-sizes', {
        h1: createMediaVariant({
            default: createVariant('1.5rem'),
            [breakpoints.l]: createVariant('2.2rem'),
        }),
        menuItem: createVariant('2.67rem'),
        base: createVariant('18px'),
        body: createVariant('1rem'),
        sub: createVariant('0.78rem'),
        button: createVariant('1rem'),
    });

    const accentColor = createProperty('accentColor', {
        default: palette.variants.accent,
    });

    const headerHeight = createProperty('headerHeight', {
        default: createMediaVariant({
            default: createVariant('75px'),
            [breakpoints.l]: createVariant('85px'),
        }),
    });

    const defaultTheme = createTheme('default', [
        // createMediaVariant('', )
    ]);

    return {
        properties: [
            bg,
            fontFamily,
            containerWidth,
            palette,
            size,
            fontSizes,
            accentColor,
            headerHeight,
        ],
        themes: [
            defaultTheme
        ]
    }
}

