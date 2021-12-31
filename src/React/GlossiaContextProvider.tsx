import React, { createContext, FC } from 'react';
import { RenderContext } from '../Context/RenderContext';
import { GlossiaContextManager } from '../Context/GlossiaContextManager';

export const GlossiaReactContext = createContext<RenderContext>(
    GlossiaContextManager.createContext()
);

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

