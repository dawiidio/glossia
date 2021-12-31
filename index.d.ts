import { IStylesObject } from './src/Styles/IStylesObject';
import { GetArgs } from './src/React/createUseStyles';
import { FC } from 'react';
import { ReactContextProviderProps } from './src/React/GlossiaContextProvider';
import { ThemeProviderProps } from './src/React/ThemeProvider';
import { IDefaultVariant, IVariantsMap } from './src/Theme/Variant/IVariantsMap';
import { IProperty } from './src/Theme/Property/IProperty';
import { IVariant } from './src/Theme/Variant/IVariant';
import { ITheme } from './src/Theme/ITheme';
import { IVirtualProperty } from './src/Theme/Property/IVirtualProperty';

export { MediaVariant } from './src/Theme/Variant/MediaVariant';
export { IBaseProperty } from './src/Theme/Property/IBaseProperty';
export { Property } from './src/Theme/Property/Property';
export { IVirtualProperty } from './src/Theme/Property/IVirtualProperty';
export { IPropertiesFactory } from './src/Theme/Property/IPropertiesFactory';
export { RenderContext, PropertyWatcher } from './src/Context/RenderContext';
export { ITheme } from './src/Theme/ITheme';
export { GlossiaContextManager } from './src/Context/GlossiaContextManager';
export { IStylesObject } from './src/Styles/IStylesObject';
export { IProperty } from './src/Theme/Property/IProperty';
export { IVariant } from './src/Theme/Variant/IVariant';

export function createUseStyles<S extends IStylesObject<P>,
    P = any,
    Props = GetArgs<S[keyof S]>>(styles: S): (props: Props) => Record<keyof S, string>;

export const GlossiaContextProvider: FC<ReactContextProviderProps>;

export const ThemeProvider: FC<ThemeProviderProps>;

export function useProperty<T extends IVariantsMap>(property: IProperty<T>): [string, ((newValue: string | number | IVariant) => void)]

export function createTheme(name: string, variants: IVariant[], parent?: ITheme): ITheme;

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant;

export function createMediaVariant(value: string, mediaQuery: string | IVariant, cssVar?: IProperty<any>): IVariant;

export function createProperty<T extends IDefaultVariant>(name: string, variants: T): IProperty<T>

export function createVirtualProperty<T extends IVariantsMap>(name: string, variants: T): IVirtualProperty<T>
