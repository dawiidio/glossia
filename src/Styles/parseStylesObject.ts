import { IParseStylesReturnData, IParseStylesArgs } from '../../types/IParseStyles';
import { camelToKebabCase, isClass, isProperty, isRecord, replaceParentReference } from '../common';
import { createValidCssRulePath } from './createValidCssRulePath';
import { IStylesObject } from '../../types/IStylesObject';

export function parseStylesObject<S extends IStylesObject>({
                                                               parentSelectorPath = [''],
                                                               styles,
                                                               level = 0,
                                                               ruleInterceptor = (val) => val,
                                                           }: IParseStylesArgs<S>): IParseStylesReturnData<S> {
    let stylesAcc: Record<string, Record<string, string> | string> = {};
    let stylesClassesMapping: Record<keyof S, string> = {} as Record<keyof S, string>;

    for (const [key, value] of Object.entries(styles)) {
        if ((typeof value === 'string' || typeof value === 'number' || isProperty(value)) && level !== 0) {
            const selectorString = parentSelectorPath.join(' ');

            if (!stylesAcc[selectorString])
                stylesAcc[selectorString] = {};

            const temp = stylesAcc[selectorString];

            if (isRecord(temp))
                temp[camelToKebabCase(key)] = String(value);
        } else if (typeof value === 'function') {
            throw new Error(`Function passed under key "${key}" - Glossia does not support dynamic styles`);
        } else {
            const selector = ruleInterceptor(createValidCssRulePath(key, parentSelectorPath));
            const styles = value;

            if (level === 0 && isClass(selector[0]) && selector.length === 1) {
                stylesClassesMapping = {
                    ...stylesClassesMapping,
                    [key.replace('.', '')]: selector.join(' ').replace('.', ''),
                };
            }

            if (level === 0 && typeof value === 'string') {
                stylesAcc = {
                    ...stylesAcc,
                    [selector.toString()]: camelToKebabCase(replaceParentReference(value, selector.toString())),
                };
            }

            const {
                styles: ss,
            } = parseStylesObject<S>({
                // @ts-ignore
                styles,
                parentSelectorPath: selector,
                level: level + 1,
            });

            stylesAcc = {
                ...stylesAcc,
                ...ss,
            };
        }
    }

    return {
        styles: stylesAcc,
        stylesClassesMapping,
    };
}
