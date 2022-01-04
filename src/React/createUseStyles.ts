import type { IStylesObject } from '../../types/IStylesObject';
import type { IClasses } from '../../types/IClassNames';
import { GlossiaContextManager } from '../Context/GlossiaContextManager';
import { GlossiaReactContext } from './GlossiaContextProvider';
import { useContext } from 'react';
import { useEffectOrCallImmediately, createClasses } from '../common';

export function createUseStyles<S extends IStylesObject>(namespace: string, stylesObject: S): () => IClasses<S> {
    const styles = GlossiaContextManager.createStyles<S>(namespace, stylesObject);
    const classes = createClasses<S>(styles.stylesheet.stylesClassesMapping);

    return function () {
        const context = useContext(GlossiaReactContext);

        useEffectOrCallImmediately(() => {
            context.useStyles(styles);
        }, [context]);

        return classes;
    };
}
