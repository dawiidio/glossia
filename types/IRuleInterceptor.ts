import { ICSSRulePath } from './ICSSRulePath';

export type IRuleInterceptor = (parent: ICSSRulePath) => ICSSRulePath;

export type IRuleInterceptorFactory = (c1: number) => IRuleInterceptor;
