import React, { createContext, FC } from 'react';
import { RenderContext } from '../Context/RenderContext';

// @ts-ignore
export const GlossiaReactContext = createContext<RenderContext>();

export interface ReactContextProviderProps {
    value: RenderContext
}

export const GlossiaContextProvider: FC<ReactContextProviderProps> = ({
                                                                        children,
                                                                        value
}) => {
    return (
        <GlossiaReactContext.Provider value={value}>
            {children}
        </GlossiaReactContext.Provider>
    )
};

