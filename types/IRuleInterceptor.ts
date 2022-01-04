import { ICSSRulePath } from './ICSSRulePath';

export type IRuleInterceptor = (parent: ICSSRulePath) => ICSSRulePath;

export type IRuleInterceptorFactory = (id: string) => IRuleInterceptor;
