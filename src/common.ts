import type { IStylesObject } from '../types/IStylesObject';
import type { IProperty } from '../types/IProperty';
import type { IVirtualProperty } from '../types/IVirtualProperty';
import type { IParsedStyles } from '../types/IParseStyles';
import type { IClasses, IClassName } from '../types/IClassNames';
import type { IVariant } from '../types/IVariant';
import type { IFlatStylesObject } from '../types/IFlatStylesObject';
import type { ITheme } from '../types/ITheme';
import type { IRenderMode } from '../types/IRenderMode';
import type { IRenderContext } from '../types/IRenderContext';
import type { ICreateContext } from '../types/IGlossiaContextManager';
import type { IMediaVariant } from '../types/IMediaVariant';
import type { IPropertyAdapter } from '../types/IPropertyAdapter';
import type { MediaObject } from '../types/IParseStyles';
import { useLayoutEffect } from 'react';
import { VirtualProperty } from './Theme/Variant/VirtualProperty';
import { GlossiaContextManager } from './Context/GlossiaContextManager';
import { Variant } from './Theme/Variant/Variant';
import { MediaVariant } from './Theme/Variant/MediaVariant';

export const getId = (): number => Math.round(Math.random() * 1e6);

export function mergeMediaObject(m1: MediaObject, m2: MediaObject): MediaObject {
    const allMediaRules = new Set([
        ...Object.keys(m1),
        ...Object.keys(m2),
    ]);
    const mediaAcc: MediaObject = {};

    for (const key of allMediaRules) {
        mediaAcc[key] = {
            ...(m1[key] || {}),
            ...(m2[key] || {}),
        };
    }

    return mediaAcc;
}

export function mediaObjectToFlatStylesObject(m: MediaObject): IFlatStylesObject {
    return Object.entries(m).reduce<IFlatStylesObject>((acc, [key, styles]) => {
        return {
            [key+' {']: Object.entries(styles).reduce((stylesAcc, [selector, styles]) => {
                // @ts-ignore
                return `${stylesAcc} ${selector} {${stringifyCssPropertiesObject(styles)}}`;
            }, '')+'}'
        };
    }, {});
}

function stringifyCssPropertiesObject(styles: Record<string, string>): string {
    return Object.entries(styles).reduce((acc, [key, val]) => {
        return `${acc} ${key}:${val};`;
    }, '');
}

export function isVariant(property: object | string | number | IProperty<any> | IMediaVariant): property is IVariant {
    return property instanceof Variant;
}

export const isMediaVariant = (variant: object | string | number | IProperty<any> | IVariant | IMediaVariant): variant is MediaVariant => variant instanceof MediaVariant;

export function isVirtualProperty(property: object | string | number): property is IVirtualProperty<any> {
    return property instanceof VirtualProperty;
}

export function extendVariantsMap(childVariants: Map<string, IVariant|IMediaVariant>, parentVariants: Map<string, IVariant|IMediaVariant>): Map<string, IVariant|IMediaVariant> {
    return new Map([
        ...parentVariants.entries(),
        ...childVariants.entries(),
    ]);
}

export const isSSR = (): boolean => typeof window === 'undefined';

export const isSSRMode = (renderMode: IRenderMode): boolean => renderMode === 'ssr';
export const isHydrationMode = (renderMode: IRenderMode): boolean => renderMode === 'hydration';
export const isDOMMode = (renderMode: IRenderMode): boolean => renderMode === 'dom';

export const isCSSRule = (rule: string = ''): boolean => rule.trimLeft().startsWith('@');
export const isMediaRule = (rule: string): boolean => /(@media)/.test(rule);
export const isGlobalRule = (rule: string): boolean => /(@global)/.test(rule);
export const isKeyframesRule = (rule: string): boolean => /(@keyframes)/.test(rule);
export const isRootPseudoRule = (rule: string): boolean => /(:root)/.test(rule);
export const isClass = (rule: string): boolean => rule.startsWith('.');

export function isRecord(predicate: string | Record<string, string>): predicate is Record<string, string> {
    return typeof predicate === 'object';
}

export function includesParentReference(selector: string): boolean {
    return selector.includes('&');
}

export function replaceParentReference(selector: string, value: string): string {
    return selector.replaceAll('&', value);
}

export function shouldCreateClassSelector(parent: string[], global?: boolean) {
    return !global &&
        (parent.length === 0) ||
        (parent.length > 1 && isMediaRule(parent[0]));
}

export const camelToKebabCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export function mergeObjectWithMediaRules(acc: Record<string, any>, obj: Record<string, any>): Record<string, any> {
    let temp = {
        ...acc,
    };

    for (const [key, val] of Object.entries(obj)) {
        if (temp[key] && key.startsWith('@media')) {
            temp[key] = {
                ...(temp[key] as {}),
                ...(val as {}),
            }
        }
        else {
            temp[key] = val;
        }
    }

    return temp;
}

export const mergeManyIStylesObjects = (...objects: IStylesObject[]): IStylesObject => {
    return objects.reduce((acc, obj) => mergeObjectWithMediaRules(acc, obj), {});
}

export const mergeThemesStylesObjects = (themes: ITheme[], propertyAdapter: IPropertyAdapter): IStylesObject => {
    return themes.reduce<IStylesObject>((acc, theme) =>{
        return mergeObjectWithMediaRules(acc, theme.createThemeInitialCss(propertyAdapter));
    }, {});
};

export function createRootClassName(key: string): string {
    return `${camelToKebabCase(key)}`;
}

export function stringifyStylesObject(styles: IFlatStylesObject | string): string {
    if (typeof styles === 'string')
        return `{ ${styles}`;

    return Object.entries(styles).reduce((acc, [property, val]) => `${acc}${property}:${val};`, '{') + '}';
}

export function parseMediaAcc(mediaAcc: Record<string, Record<string, string>>): Record<string, string> {
    return Object.entries(mediaAcc).reduce((acc, [media, nestedObject]) => {
        const nestedRulesString = Object.entries(nestedObject).map((arr) => arr.join(' ')).join(' ');

        return {
            ...acc,
            [media + '{']: `${nestedRulesString} }`,
        };
    }, {});
}

/**
 *
 * @deprecated this function will be removed after move keyframes parsing to the same mechanism as @media rules in parseStylesObject.ts
 * @param fso
 */
export function fixMediaRules(fso: IParsedStyles): IFlatStylesObject {
    let mediaAcc: Record<string, Record<string, string>> = {};
    let acc: Record<string, string> = {};

    for (const [selector, stylesObjectOrString] of Object.entries(fso)) {
        if (isCSSRule(selector) && typeof stylesObjectOrString !== 'string') {
            const [media, nestedSelector] = selector.split('{');

            if (!mediaAcc[media])
                mediaAcc[media] = {};

            mediaAcc[media][nestedSelector] = stringifyStylesObject(stylesObjectOrString);
            continue;
        }

        acc[selector] = stringifyStylesObject(stylesObjectOrString);
    }

    return {
        ...acc,
        ...parseMediaAcc(mediaAcc),
    };
}

export const useEffectOrCallImmediately = isSSR()
    ? ((cb: (() => any), arr: Array<any>) => cb())
    : useLayoutEffect;

export function joinClassNames(...classes: Array<string | IClassName>): string {
    return classes.join(' ');
}

export function createClassName(className: string): IClassName {
    const f = function ClassName(renderClass: boolean) {
        return renderClass ? className : '';
    };

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
        join: joinClassNames,
    });
}

export const RENDERER_ID = 'glossia-dom-styles';
export const SSR_RENDERER_ID = 'glossia-ssr-styles';
const DATA_ATTRIBUTE = 'data-classes-mapping';

export function renderContextToHtmlString(ctx: IRenderContext, elementId = SSR_RENDERER_ID): string {
    return `<style id="${elementId}" ${DATA_ATTRIBUTE}="${JSON.stringify(ctx.getStylesClassMapping()).replaceAll('"', '\'')}">${ctx}</style>`;
}

export function getHydrationModeOptions(elementId = SSR_RENDERER_ID): Pick<ICreateContext, 'prerenderedData' | 'mode'> {
    if (isSSR())
        throw new Error(`Glossia function getHydrationModeOptions() can not be called on server side`);

    const el = document.getElementById(elementId);

    if (!el)
        throw new Error(`Glossia can not find SSR rendered element with id #${elementId}`);

    let stringData = el.getAttribute(DATA_ATTRIBUTE);

    if (!stringData)
        throw new Error(`Glossia can not find prerendered data in element with id #${elementId}`);

    stringData = stringData.replaceAll('\'', '"');

    try {
        const prerenderedData = JSON.parse(stringData);

        GlossiaContextManager.setPrerenderedClasses(prerenderedData);

        return {
            mode: 'hydration',
            prerenderedData,
        };
    } catch {
        throw new Error(`Parsing error, Glossia can not parse prerendered data from SSR element with id #${elementId}`);
    }
}

export const GLOBAL_NAMESPACE = '@@GLOBAL';
