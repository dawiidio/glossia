import { ICSSRulePath } from './ICSSRulePath';

export type IRuleInterceptor = (parent: ICSSRulePath, preprocessed: boolean) => ICSSRulePath;

export type IRuleInterceptorFactory = (c1: number, c2?: number) => IRuleInterceptor;
