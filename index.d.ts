import { CSSProperties, FC, Context } from 'react';

export interface IStylesObject<T = {}> {
    [key: string]: CSSProperties | IPropertiesFactory<T> | IStylesObject<T> | string | number | IProperty<any>
}

export type FnType = (...args:any[]) => any;
export type GetArgs<Fn> = Fn extends FnType ? Parameters<Fn>[0] : never;

export const GlossiaReactContext: Context<IRenderContext>;

export const GlossiaContextProvider: FC<IReactContextProviderProps>

export interface IReactContextProviderProps {
    value: IRenderContext
}

export interface ThemeProviderProps {
    theme?: ITheme
    className?: string
}

export type IVariantsMap = Record<string, IVariant>;

export interface IDefaultVariant extends IVariantsMap {
    default: IVariant
}

export interface IPropertyAdapter {
    getNativePropertyGetter(name: string): string
    getNativePropertySetter(name: string, value: string): string
    getNativePropertyName(name: string): string
    setPropertyValue(name: string, value: string): void
    getPropertyValue(name: string): string
}

export type IFlatStylesObject = Record<string, string>;

export type ICSSRulePath = string[];

export type IRuleInterceptor = (parent: ICSSRulePath, preprocessed: boolean) => ICSSRulePath;

export type IRuleInterceptorFactory = (c1: number, c2?: number) => IRuleInterceptor;

export interface IBaseProperty<T extends IVariantsMap> {
    name: string
    variants: T
}

export class Variant implements IVariant {

}

export class MediaVariant implements  IVariant {

}

export class Property<T extends IDefaultVariant> implements IProperty<any>{

}

export type PropertyWatcher = (value: string) => void;

export interface IVirtualProperty<T extends IVariantsMap> extends IBaseProperty<T> {}

export type IPropertiesFactory<T> = ((props: T | undefined) => CSSProperties);

export interface ITheme {
    name: string
    variants: Map<string, IVariant>

    createThemeInitialCss(): IStylesObject
    getClassName(): string
}

export class Theme implements ITheme {
    name: string
    variants: Map<string, IVariant>

    createThemeInitialCss(): IStylesObject
    getClassName(): string
}

export interface IRenderContext {
    useStaticStyles(staticStyles: IStaticStyles): void;

    setPropertyValue(property: IProperty<any> | IVirtualProperty<any>, value: IVariant | string | number): void;

    getPropertyValue(property: IProperty<any> | IVirtualProperty<any>): string;

    watchProperty(property: IProperty<any> | IVirtualProperty<any>, callback: PropertyWatcher): (() => void);

    renderThemingRelatedStylesheets(): void;

    isThemeRendered(theme: ITheme): void;

    toString(): string;

    destroy(): void;
}

export interface IStylesheet<T> {
    staticStyles: IStaticStyles;
    dynamicStyles: IStylesObject<T>;
    staticClassesMapping: Record<string, string>;
    parsedStaticStyles: IFlatStylesObject;

    parseDynamicStyles(props: T, ruleInterceptor?: IRuleInterceptor): { styles: IStaticStyles, classesMapping: Record<string, string>, parsedStyles: Record<string, string> };

    mergeWithStaticClassesMapping(classesMapping: Record<string, string>): any;

    destroy(): void;
}

export interface IStaticStyles {
    stylesheet: IStylesheet<any>;
    readonly styles: IStylesObject<any>;
    readonly counterValue: number;
}

export class GlossiaContextManager {
    static createContext(): IRenderContext;

    static destroyContext(context: IRenderContext);

    static createStaticStyles<T>(styles: IStylesObject<T>): IStaticStyles;
}

export interface IVariant {
    property?: IBaseProperty<any>;
    mediaQuery?: string;
    value: string;

    getKeyId(): string;
}

export interface IProperty<T extends IVariantsMap> extends IBaseProperty<T> {
    toDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject;

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject;
}

export interface IStylesObject<T = {}> {
    [key: string]: CSSProperties | IPropertiesFactory<T> | IStylesObject<T> | string | number | IProperty<any>;
}

export function createUseStyles<S extends IStylesObject<P>,
    P = any,
    Props = GetArgs<S[keyof S]>>(styles: S): (props: Props) => Record<keyof S, string>;

export const ThemeProvider: FC<ThemeProviderProps>;

export function useProperty<T extends IVariantsMap>(property: IProperty<T>): [string, ((newValue: string | number | IVariant) => void)]

export function createTheme(name: string, variants: IVariant[], parent?: ITheme): ITheme;

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant;

export function createMediaVariant(value: string, mediaQuery: string | IVariant, cssVar?: IProperty<any>): IVariant;

export function createProperty<T extends IDefaultVariant>(name: string, variants: T): IProperty<T>

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T>
