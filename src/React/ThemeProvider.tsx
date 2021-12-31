import { ITheme } from '../Theme/ITheme';
import React, { FC, useContext } from 'react';
import { GlossiaReactContext } from './GlossiaContextProvider';

export interface ThemeProviderProps {
    theme?: ITheme
    className?: string
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children, theme, className = '' }) => {
    const ctx = useContext(GlossiaReactContext);

    if (theme && !ctx.isThemeRendered(theme)) {
        throw new Error(`Theme ${theme.name} was not rendered in current context`);
    }

    return (
        <div className={`${theme ? theme.getClassName() : ''} ${className}`}>
            {children}
        </div>
    );
}
