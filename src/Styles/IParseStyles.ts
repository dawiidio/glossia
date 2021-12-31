import { IStylesObject } from './IStylesObject';
import { IRuleInterceptor } from './IRuleInterceptor';
import { IPropertyAdapter } from '../Theme/Property/IPropertyAdapter';

export interface IParseStylesArgs<P> {
    styles: IStylesObject<P>
    parentSelectorPath?: string[]
    level?: number
    ruleInterceptor?: IRuleInterceptor
    preprocessed?: boolean
    props?: P
    propertyAdapter?: IPropertyAdapter
}

export interface IParsedStyles<T> {
    staticStyles: IStaticStyles
    dynamicStyles: IStylesObject<T>
    staticClassesMapping: Record<string, string>
}

export type IStaticStyles = Record<string, Record<string, string>>;
