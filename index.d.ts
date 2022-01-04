import { FC, Context } from 'react';
import { ITheme } from './types/ITheme';
import { IRenderContext } from './types/IRenderContext';
import { IStylesObject } from './types/IStylesObject';
import { ICreateContext } from './types/IGlossiaContextManager';
import { IStyles } from './types/IStyles';
import { IProperty } from './types/IProperty';
import { IVariant } from './types/IVariant';
import { IVirtualProperty } from './types/IVirtualProperty';
import { IDefaultVariant, IVariantsMap } from './types/IVariantsMap';
import { IClasses, IClassName } from './types/IClassNames';

export { IClasses, IClassName } from './types/IClassNames';
export { ITheme } from './types/ITheme';
export { IProperty } from './types/IProperty';
export { IVariant } from './types/IVariant';
export { IVirtualProperty } from './types/IVirtualProperty';

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
}

export function createUseStyles<S extends IStylesObject>(styles: S): () => IClasses<S>;

export const ThemeProvider: FC<IThemeProviderProps>;

export function useProperty<T extends IVariantsMap>(property: IProperty<T>): [string, ((newValue: string | number | IVariant) => void)]

export function createTheme(name: string, variants: IVariant[], parent?: ITheme): ITheme;

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant;

export function createMediaVariant(value: string, mediaQuery: string | IVariant, cssVar?: IProperty<any>): IVariant;

export function createProperty<T extends IDefaultVariant>(name: string, variants: T): IProperty<T>

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T>
