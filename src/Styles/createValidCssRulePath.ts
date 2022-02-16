import type { ICSSRulePath } from '../../types/ICSSRulePath';
import {
    camelToKebabCase,
    createRootClassName,
    includesParentReference,
    isCSSRule, isKeyframesRule,
    isRootPseudoRule,
    replaceParentReference,
    shouldCreateClassSelector,
} from '../common';

export function createValidCssRulePath(ruleOrSelector: string, parent: ICSSRulePath, global?: boolean): ICSSRulePath {
    parent = parent[0] === '' ? parent.slice(1) : parent;

    if (isCSSRule(ruleOrSelector) && !parent.length) {
        if (isKeyframesRule(ruleOrSelector)) {
            return [`${ruleOrSelector} {`];
        }

        // rules are accumulated and parsed in parseStylesObject that's why we can return here empty string in case if path starts with rule
        return [''];
    } else if (isCSSRule(ruleOrSelector) && parent.length) {
        if (isCSSRule(parent[0])) {
            throw new Error(`Rules can not extend: ${parent.join(' ')}`);
        }
        // in this case we handle parsing media objects in other places so here return only selectors without media rules
        return [...parent];
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
                    replaceParentReference(ruleOrSelector, parent.slice(-1)[0]),
                ];
            }

            return [
                ...parent,
                shouldCreateClassSelector(parent, global) ? `.${createRootClassName(ruleOrSelector)}` : ruleOrSelector,
            ];
        }

        return [shouldCreateClassSelector(parent, global) ? `.${createRootClassName(ruleOrSelector)}` : ruleOrSelector];
    }
}
