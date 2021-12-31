import { useContext, useEffect, useMemo } from 'react';
import { IStylesObject } from '../Styles/IStylesObject';
import { ruleInterceptorFactory } from '../Styles/ruleInterceptorFactory';
import { GlossiaReactContext } from './GlossiaContextProvider';
import { GlossiaContextManager } from '../Context/GlossiaContextManager';
import { DynamicStyles } from '../Context/DynamicStyles';
import { useEffectOrCallImmediately } from '../common';

export type FnType = (...args:any[]) => any;
export type GetArgs<Fn> = Fn extends FnType ? Parameters<Fn>[0] : never;

export function createUseStyles<S extends IStylesObject<P>, P = any, Props = GetArgs<S[keyof S]>>(styles: S): (props: Props) => Record<keyof S, string> {
    const ss = GlossiaContextManager.createStaticStyles(styles);

    return function (props: Props): Record<keyof S, string> {
        const context = useContext(GlossiaReactContext);

        const dynamicStyles = useMemo(() => {
            context.useStaticStyles(ss);

            const ds = new DynamicStyles(
                ss,
                context.counter.increase(),
                context.renderer,
                ruleInterceptorFactory,
            );

            ds.render(props);

            return ds;
        }, [context]);

        useEffectOrCallImmediately(() => {
            dynamicStyles.render(props);
        }, [...Object.values(props || {})]);

        useEffect(() => () => {
            dynamicStyles.clean();
        }, [dynamicStyles]);

        return ss.stylesheet.mergeWithStaticClassesMapping(
            dynamicStyles.classesMapping,
        ) as Record<keyof S, string>;
    };
}

