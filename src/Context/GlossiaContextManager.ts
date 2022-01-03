import { isSSR } from '../common';
import { rendererFactory } from '../Renderer/rendererFactory';
import { counterFactory } from '../Counter/counterFactory';
import { propertyAdapterFactory } from '../Theme/Property/propertyAdapterFactory';
import { IStylesObject } from '../../types/IStylesObject';
import { IProperty } from '../../types/IProperty';
import { IVirtualProperty } from '../../types/IVirtualProperty';
import { ITheme } from '../../types/ITheme';
import { RenderContext } from './RenderContext';
import { Styles } from './Styles';
import { Counter } from '../Counter/Counter';

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
    private static staticStylesCounter = new Counter();

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

    static createStyles<S extends IStylesObject>(styles: S): Styles<S> {
        return new Styles<S>(styles, this.staticStylesCounter.increase());
    }
}
