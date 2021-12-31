import { isClass } from '../common';
import { IRuleInterceptorFactory } from './IRuleInterceptor';

export const ruleInterceptorFactory: IRuleInterceptorFactory = (c1: number, c2?: number) => (parent: string[], dynamic: boolean) => {
    const [cls] = parent.slice(0);

    if (isClass(cls)) {
        return [
            ...parent.slice(1),
            cls + '-' + c1 +''+ ((dynamic && Number.isSafeInteger(c2)) ? '-'+c2 : ''),
        ];
    }

    return parent;
};
