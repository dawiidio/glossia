import { IParsedStyles, IParseStylesArgs } from './IParseStyles';
import { IStylesObject } from './IStylesObject';
import { camelToKebabCase, isClass, isCSSRule, isPropertiesFactory, isProperty } from '../common';
import { createValidCssRulePath } from './createValidCssRulePath';

export function parseStylesObject<T>({
                                  parentSelectorPath = [''],
                                  styles,
                                  level = 0,
                                  ruleInterceptor = (val) => val,
                                  preprocessed = false,
                                  props,
                              }: IParseStylesArgs<T>): IParsedStyles<T> {
    let staticStyles: Record<string, Record<string, string>> = {};
    let staticClassesMapping: Record<string, string> = {};
    let dynamicStyles: IStylesObject<T> = {};

    for (const [key, value] of Object.entries(styles)) {
        if (typeof value === 'string' || typeof value === 'number' || isProperty(value)) {
            const selectorString = parentSelectorPath.join(' ');

            if (!staticStyles[selectorString])
                staticStyles[selectorString] = {};

            staticStyles[selectorString][camelToKebabCase(key)] = String(value);
        } else {
            if (isPropertiesFactory<T>(value) && !preprocessed) {
                dynamicStyles[key] = value;
            }
            else {
                const selector = ruleInterceptor(createValidCssRulePath(key, parentSelectorPath), preprocessed);
                const styles = isPropertiesFactory<T>(value) ? value(props) : value;

                if (level === 0 && isClass(selector[0]) && selector.length === 1) {
                    staticClassesMapping = {
                        ...staticClassesMapping,
                        [key.replace('.', '')]: selector.join(' ').replace('.', ''),
                    };
                }

                const {
                    dynamicStyles: ds,
                    staticStyles: ss,
                } = parseStylesObject<T>({
                    // @ts-ignore
                    styles,
                    parentSelectorPath: selector,
                    level: level + 1,
                    props,
                    preprocessed,
                });

                dynamicStyles = {
                    ...dynamicStyles,
                    ...Object.keys(ds).length ? {
                        [key]: ds,
                    } : {},
                };
                staticStyles = {
                    ...staticStyles,
                    ...ss,
                };
            }
        }
    }

    return {
        staticStyles,
        dynamicStyles,
        staticClassesMapping,
    };
}
