import { IStylesObject } from '../../types/IStylesObject';
import { GlossiaContextManager } from '../Context/GlossiaContextManager';
import { GlossiaReactContext } from './GlossiaContextProvider';
import { useContext } from 'react';
import { useEffectOrCallImmediately } from '../common';

export function createUseStyles<S extends IStylesObject>(stylesObject: S): () => Record<keyof S, string> {
    const styles = GlossiaContextManager.createStyles<S>(stylesObject);

    return function () {
        const context = useContext(GlossiaReactContext);

        useEffectOrCallImmediately(() => {
            context.useStyles(styles);
        }, [context]);

        return styles.stylesheet.stylesClassesMapping;
    };
}
