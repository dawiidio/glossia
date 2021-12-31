import { ICSSRulePath } from './ICSSRulePath';
import {
    camelToKebabCase,
    createRootClassName,
    includesParentReference,
    isCSSRule,
    isRootPseudoRule,
    replaceParentReference,
    shouldCreateClassSelector,
} from '../common';

export function createValidCssRulePath(ruleOrSelector: string, parent: ICSSRulePath): ICSSRulePath {
    parent = parent[0] === '' ? parent.slice(1) : parent;

    if (isCSSRule(ruleOrSelector) && !parent.length) {
        return [`${ruleOrSelector} {`];
    } else if (isCSSRule(ruleOrSelector) && parent.length) {
        if (isCSSRule(parent[0])) {
            throw new Error(`Rules can not extend: ${parent.join(' ')}`);
        }

        return [`${ruleOrSelector} {`, ...parent];
    } else if (isRootPseudoRule(ruleOrSelector)) {
        return [`${ruleOrSelector}`];
    } else {
        if (parent) {
            if (isCSSRule(parent[0])) {
                return [...parent, camelToKebabCase(`${ruleOrSelector}`)];
            }

            if (includesParentReference(ruleOrSelector)) {
                return [
                    ...parent.slice(0, -1),
                    camelToKebabCase(replaceParentReference(ruleOrSelector, parent.slice(-1)[0])),
                ];
            }

            return [
                ...parent,
                shouldCreateClassSelector(parent) ? `.${createRootClassName(ruleOrSelector)}` : ruleOrSelector,
            ];
        }

        return [`.${createRootClassName(ruleOrSelector)}`];
    }
}
