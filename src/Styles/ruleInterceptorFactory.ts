import { isClass } from '../common';
import { IRuleInterceptorFactory } from '../../types/IRuleInterceptor';

export const ruleInterceptorFactory: IRuleInterceptorFactory = (c1: number) => (parent: string[]) => {
    const [cls] = parent.slice(0);

    if (isClass(cls)) {
        return [
            ...parent.slice(1),
            cls + '-' + c1,
        ];
    }

    return parent;
};
