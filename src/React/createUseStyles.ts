import { IStylesObject } from '../../types/IStylesObject';
import { GlossiaContextManager } from '../Context/GlossiaContextManager';
import { GlossiaReactContext } from './GlossiaContextProvider';
import { useContext } from 'react';
import { useEffectOrCallImmediately, createClasses } from '../common';
import { IClasses } from '../../types/IClassNames';

export function createUseStyles<S extends IStylesObject>(stylesObject: S): () => IClasses<S> {
    const styles = GlossiaContextManager.createStyles<S>(stylesObject);
    const classes = createClasses<S>(styles.stylesheet.stylesClassesMapping);

    return function () {
        const context = useContext(GlossiaReactContext);

        useEffectOrCallImmediately(() => {
            context.useStyles(styles);
        }, [context]);

        return classes;
    };
}
