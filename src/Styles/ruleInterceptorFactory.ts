import { isClass } from '../common';
import type { IRuleInterceptorFactory } from '../../types/IRuleInterceptor';

export const ruleInterceptorFactory: IRuleInterceptorFactory = (namespace: string) => (parent: string[]) => {
    const [cls] = parent.slice(0);

    if (isClass(cls)) {
        return [
            ...parent.slice(1),
            `.${namespace}_${cls.replace('.', '')}`,
        ];
    }

    return parent;
};
