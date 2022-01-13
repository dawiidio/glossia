import { IStylesObject } from './IStylesObject';
import { IRuleInterceptor } from './IRuleInterceptor';
import { IPropertyAdapter } from './IPropertyAdapter';

export interface IParseStylesArgs<S extends IStylesObject> {
    styles: S
    parentSelectorPath?: string[]
    level?: number
    ruleInterceptor?: IRuleInterceptor
    propertyAdapter?: IPropertyAdapter
    global?: boolean
}

export interface IParseStylesReturnData<S extends IStylesObject> {
    styles: IParsedStyles
    stylesClassesMapping: Record<keyof S, string>
}

export type IParsedStyles = Record<string, Record<string, string>|string>;
