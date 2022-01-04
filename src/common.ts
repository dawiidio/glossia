import type { IStylesObject } from '../types/IStylesObject';
import type { IProperty } from '../types/IProperty';
import type { IVirtualProperty } from '../types/IVirtualProperty';
import type { IParsedStyles } from '../types/IParseStyles';
import type { IClasses, IClassName } from '../types/IClassNames';
import type { IVariant } from '../types/IVariant';
import type { IFlatStylesObject } from '../types/IFlatStylesObject';
import type { ITheme } from '../types/ITheme';
import { Property } from './Theme/Property/Property';
import { useLayoutEffect } from 'react';
import { VirtualProperty } from './Theme/Variant/VirtualProperty';

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

export const isSSR = (): boolean => typeof window === 'undefined';

export const isCSSRule = (rule: string = ''): boolean => rule.trimLeft().startsWith('@');
export const isMediaRule = (rule: string): boolean => /(@media)/.test(rule);
export const isGlobalRule = (rule: string): boolean => /(@global)/.test(rule);
export const isKeyframesRule = (rule: string): boolean => /(@keyframes)/.test(rule);
export const isRootPseudoRule = (rule: string): boolean => /(:root)/.test(rule);
export const isClass = (rule: string): boolean => rule.startsWith('.');

export function isRecord(predicate: string|Record<string, string>): predicate is Record<string, string> {
    return typeof predicate === 'object';
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

export function stringifyStylesObject(styles: IFlatStylesObject|string): string {
    if (typeof styles === 'string')
        return `{ ${styles}`;

    return Object.entries(styles).reduce((acc, [property, val]) => `${acc}${property}:${val};`, '{') + '}';
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

export function fixMediaRules(fso: IParsedStyles): IFlatStylesObject {
    let mediaAcc: Record<string, Record<string, string>> = {};
    let acc: Record<string, string> = {};

    for (const [selector, stylesObjectOrString] of Object.entries(fso)) {
        if (isCSSRule(selector) && typeof stylesObjectOrString !== 'string') {
            const [media, nestedSelector] = selector.split('{');

            if (!mediaAcc[media])
                mediaAcc[media] = {};

            mediaAcc[media][nestedSelector] = stringifyStylesObject(stylesObjectOrString);
        }

        acc[selector] = stringifyStylesObject(stylesObjectOrString);
    }

    return {
        ...acc,
        ...parseMediaAcc(mediaAcc)
    }
}

export const useEffectOrCallImmediately = isSSR()
    ? ((cb: (() => any), arr: Array<any>) => cb())
    : useLayoutEffect;

export function joinClassNames(...classes: Array<string|IClassName>): string {
    return classes.join(' ');
}

export function createClassName(className: string): IClassName {
    const f = function ClassName(renderClass: boolean) {
        return renderClass ? className : '';
    }

    f.toString = () => className;

    return f;
}

export function createClasses<S>(classMapping: Record<keyof S, string>): IClasses<S> {
    // @ts-ignore
    return Object.entries(classMapping).reduce((acc, [key, className]) => ({
        ...acc,
        // @ts-ignore
        [key]: createClassName(className),
    }), {
        join: joinClassNames
    });
}
