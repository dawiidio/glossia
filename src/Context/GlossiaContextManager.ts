import type { IStylesObject } from '../../types/IStylesObject';
import type { IProperty } from '../../types/IProperty';
import type { IVirtualProperty } from '../../types/IVirtualProperty';
import type { ITheme } from '../../types/ITheme';
import type { IStyles } from '../../types/IStyles';
import { isSSR } from '../common';
import { rendererFactory } from '../Renderer/rendererFactory';
import { counterFactory } from '../Counter/counterFactory';
import { propertyAdapterFactory } from '../Theme/Property/propertyAdapterFactory';
import { RenderContext } from './RenderContext';
import { Styles } from './Styles';

const RENDERER_ID = 'client-styles';
const SSR_RENDERER_ID = 'ssr-styles';

const getId = (): number => Math.round(Math.random() * 1e6);

export interface ICreateContext {
    ssr?: boolean;
    properties?: Array<IProperty<any> | IVirtualProperty<any>>;
    themes?: ITheme[];
}

export class GlossiaContextManager {
    private static contexts = new Map<number, RenderContext>();
    private static stylesNamespaces = new Map<string, IStyles<any>>();

    static createContext({
                             ssr = isSSR(),
                             properties = [],
                             themes = [],
                         }: ICreateContext = {}) {
        const renderer = rendererFactory({
            ssr,
            elementId: ssr ? SSR_RENDERER_ID : RENDERER_ID,
            attributes: {},
        });

        const counter = counterFactory({
            ssr,
        });

        const ctxId = getId();

        const propertyAdapter = propertyAdapterFactory({
            ssr,
        });

        const ctx = new RenderContext(
            ctxId,
            renderer,
            counter,
            propertyAdapter,
            properties,
            themes,
            ssr,
        );

        this.contexts.set(ctxId, ctx);

        return ctx;
    }

    static destroyContext(context: RenderContext) {
        this.contexts.delete(context.id);

        context.destroy();
    }

    static getContextById(id: number): RenderContext | undefined {
        return this.contexts.get(id);
    }

    static getContextByIndex(index: number): RenderContext | undefined {
        return [...this.contexts.values()][index];
    }

    static createStyles<S extends IStylesObject>(namespace: string, styles: S): Styles<S> {
        if (this.stylesNamespaces.has(namespace))
            return this.stylesNamespaces.get(namespace) as Styles<S>;

        const stylesCls = new Styles<S>(styles, namespace);

        this.stylesNamespaces.set(namespace, stylesCls);

        return stylesCls;
    }
}
