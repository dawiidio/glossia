import { isNonBrowserEnv } from '../common';
import { rendererFactory } from '../Renderer/rendererFactory';
import { counterFactory } from '../Counter/counterFactory';
import { propertyAdapterFactory } from '../Theme/Property/propertyAdapterFactory';
import { IStylesObject } from '../Styles/IStylesObject';
import { IProperty } from '../Theme/Property/IProperty';
import { IVirtualProperty } from '../Theme/Property/IVirtualProperty';
import { ITheme } from '../Theme/ITheme';
import { RenderContext } from './RenderContext';
import { StaticStyles } from './StaticStyles';
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
                             ssr = isNonBrowserEnv(),
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

    static createStaticStyles<T>(styles: IStylesObject<T>): StaticStyles {
        return new StaticStyles(styles, this.staticStylesCounter.increase());
    }
}
