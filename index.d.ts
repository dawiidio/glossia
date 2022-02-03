import type { FC, Context } from 'react';
import type { ITheme } from './types/ITheme';
import type { IRenderContext } from './types/IRenderContext';
import type { IStylesObject } from './types/IStylesObject';
import type { ICreateContext } from './types/IGlossiaContextManager';
import type { IStyles } from './types/IStyles';
import type { IProperty } from './types/IProperty';
import type { IVariant } from './types/IVariant';
import type { IVirtualProperty } from './types/IVirtualProperty';
import type { IDefaultVariant, IVariantsMap } from './types/IVariantsMap';
import type { IClasses, IClassName } from './types/IClassNames';
import type { IMediaVariantVariant } from './types/IMediaVariant';

export type { IClasses, IClassName } from './types/IClassNames';
export type { ITheme } from './types/ITheme';
export type { IProperty } from './types/IProperty';
export type { IVariant } from './types/IVariant';
export type { IVirtualProperty } from './types/IVirtualProperty';
export type { IRenderContext } from './types/IRenderContext';

export const GlossiaReactContext: Context<IRenderContext>;

export const GlossiaContextProvider: FC<IReactContextProviderProps>;

export interface IReactContextProviderProps {
    value: IRenderContext;
}

export interface IThemeProviderProps {
    theme?: ITheme;
    className?: string;
}

export class GlossiaContextManager {
    static createContext(options?: ICreateContext): IRenderContext;

    static destroyContext(context: IRenderContext): void;

    static createStyles<S extends IStylesObject>(styles: S): IStyles<S>

    static getContextByIndex(index: number): IRenderContext | undefined

    static getContextById(id: number): IRenderContext | undefined

    static setPrerenderedClasses(prerendered: Record<string, Record<string, string>>): void

    static setDevelopmentMode(): void

    static isDevelopmentMode(): boolean

    static createGlobalStyles<S extends IStylesObject>(namespace: string, styles: S): void
}

export function createUseStyles<S extends IStylesObject>(namespace: string, styles: S): () => IClasses<S>;

export const ThemeProvider: FC<IThemeProviderProps>;

export function useProperty<T extends IVariantsMap>(property: IProperty<T>): [string, ((newValue: string | number | IVariant) => void)]

export function createTheme(name: string, variants: Array<IVariant|IMediaVariantVariant>, parent?: ITheme): ITheme;

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant;

export function createMediaVariant(mediaQueries: Record<string, IVariant | IMediaVariantVariant>, cssVar?: IProperty<any>): IMediaVariantVariant

export function createProperty<T extends IDefaultVariant>(name: string, variants: T): IProperty<T>

export function createPropertiesSet<T extends IVariantsMap>(name: string, variants: T): IProperty<T>

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T>

export function renderContextToHtmlString(ctx: IRenderContext, elementId?: string): string;

export function getHydrationModeOptions(elementId?: string): Pick<ICreateContext, 'prerenderedData' | 'mode'>

export function createGlobalStyles(namespace: string, styles: IStylesObject): void;
