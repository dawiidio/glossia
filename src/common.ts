import { IProperty } from './Theme/Property/IProperty';
import { Property } from './Theme/Property/Property';
import { IVariant } from './Theme/Variant/IVariant';
import { CSSProperties, useLayoutEffect } from 'react';
import { IPropertiesFactory } from './Theme/Property/IPropertiesFactory';
import { IFlatStylesObject } from './Styles/IFlatStylesObject';
import { IStaticStyles } from './Styles/IStaticStyles';
import { ITheme } from './Theme/ITheme';
import { IStylesObject } from './Styles/IStylesObject';
import { VirtualProperty } from './Theme/Variant/VirtualProperty';
import { IVirtualProperty } from './Theme/Property/IVirtualProperty';

export function isProperty(property: object | string | number): property is IProperty<any> {
    return property instanceof Property;
}

export function isVirtualProperty(property: object | string | number): property is IVirtualProperty<any> {
    return property instanceof VirtualProperty;
}

export function extendVariantsMap(childVariants: Map<string, IVariant>, parentVariants: Map<string, IVariant>): Map<string, IVariant> {
    return new Map([
        ...parentVariants.entries(),
        ...childVariants.entries(),
    ]);
}

export const isNonBrowserEnv = (): boolean => !globalThis.navigator;

export const isCSSRule = (rule: string = ''): boolean => rule.trimLeft().startsWith('@');
export const isMediaRule = (rule: string): boolean => /(@media)/.test(rule);
export const isKeyframesRule = (rule: string): boolean => /(@keyframes)/.test(rule);
export const isRootPseudoRule = (rule: string): boolean => /(:root)/.test(rule);
export const isClass = (rule: string): boolean => rule.startsWith('.');

export function isPropertiesFactory<T>(propsOrFn: CSSProperties | IPropertiesFactory<T> | string): propsOrFn is IPropertiesFactory<T> {
    return typeof propsOrFn === 'function';
}

export function includesParentReference(selector: string): boolean {
    return selector.includes('&');
}

export function replaceParentReference(selector: string, value: string): string {
    return selector.replaceAll('&', value);
}

export function shouldCreateClassSelector(parent: string[]) {
    return (parent.length === 0) ||
        (parent.length > 1 && isMediaRule(parent[0]));
}

export const camelToKebabCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export const mergeThemesStylesObjects = (themes: ITheme[]): IStylesObject => {
    return themes.reduce((acc, theme) => ({
        ...acc,
        ...theme.createThemeInitialCss()
    }), {});
};

export function createRootClassName(key: string): string {
    return `${camelToKebabCase(key)}`;
}

export function stringifyStylesObject(obj: IFlatStylesObject): string {
    return Object.entries(obj).reduce((acc, [property, val]) => `${acc}${property}:${val};`, '{') + '}';
}

export function parseMediaAcc(mediaAcc: Record<string, Record<string, string>>): Record<string, string> {
    return Object.entries(mediaAcc).reduce((acc, [media, nestedObject]) => {
        const nestedRulesString = Object.entries(nestedObject).map((arr) => arr.join(' ')).join(' ');

        return {
            ...acc,
            [media+'{']: `${nestedRulesString} }`
        };
    }, {});
}

export function fixMediaRules(fso: IStaticStyles): IFlatStylesObject {
    let mediaAcc: Record<string, Record<string, string>> = {};
    let acc: Record<string, string> = {};

    for (const [selector, stylesObject] of Object.entries(fso)) {
        if (isCSSRule(selector)) {
            const [media, nestedSelector] = selector.split('{');

            if (!mediaAcc[media])
                mediaAcc[media] = {};

            mediaAcc[media][nestedSelector] = stringifyStylesObject(stylesObject);
        }

        acc[selector] = stringifyStylesObject(stylesObject);
    }

    return {
        ...acc,
        ...parseMediaAcc(mediaAcc)
    }
}

export const useEffectOrCallImmediately = isNonBrowserEnv()
    ? ((cb: (() => any), arr: Array<any>) => cb())
    : useLayoutEffect;
