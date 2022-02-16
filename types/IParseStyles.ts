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

export type MediaObject = Record<string, IParsedStyles>;

export interface IParseStylesReturnData<S extends IStylesObject> {
    styles: IParsedStyles
    media: MediaObject
    stylesClassesMapping: Record<keyof S, string>
}

export type IParsedStyles = Record<string, Record<string, string>|string>;
