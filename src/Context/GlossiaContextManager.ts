import type { IStylesObject } from '../../types/IStylesObject';
import type { IStyles } from '../../types/IStyles';
import type { ICreateContext } from '../../types/IGlossiaContextManager';
import { isSSR, isSSRMode, RENDERER_ID, SSR_RENDERER_ID } from '../common';
import { rendererFactory } from '../Renderer/rendererFactory';
import { counterFactory } from '../Counter/counterFactory';
import { propertyAdapterFactory } from '../Theme/Property/propertyAdapterFactory';
import { RenderContext } from './RenderContext';
import { Styles } from './Styles';
import { GlobalStyles } from './GlobalStyles';

const getId = (): number => Math.round(Math.random() * 1e6);

export class GlossiaContextManager {
    private static contexts = new Map<number, RenderContext>();
    private static stylesNamespaces = new Map<string, IStyles<any>>();
    private static globalStylesNamespaces = new Map<string, IStyles<any>>();
    private static prerenderedClasses: Record<string, Record<string, string>> = {};
    private static developmentMode: boolean = false;

    static createContext({
                             properties = [],
                             themes = [],
                             mode = isSSR() ? 'ssr' : 'dom',
                             prerenderedData = {},
                         }: ICreateContext = {}) {
        const ssr = isSSRMode(mode);

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
            mode,
            prerenderedData,
        );

        this.contexts.set(ctxId, ctx);

        return ctx;
    }

    static setPrerenderedClasses(prerendered: Record<string, Record<string, string>>) {
        this.prerenderedClasses = prerendered;
    }

    static setDevelopmentMode(): void {
        this.developmentMode = true;
    }

    static isDevelopmentMode(): boolean {
        return this.developmentMode;
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
        if (!this.developmentMode && this.stylesNamespaces.has(namespace))
            return this.stylesNamespaces.get(namespace) as Styles<S>;

        const stylesClasses = new Styles<S>(
            styles,
            namespace,
            this.prerenderedClasses[namespace] as Record<keyof S, string>,
        );

        this.stylesNamespaces.set(namespace, stylesClasses);

        return stylesClasses;
    }

    static createGlobalStyles<S extends IStylesObject>(namespace: string, styles: S): void {
        if (!this.developmentMode && this.globalStylesNamespaces.has(namespace))
            return;

        this.globalStylesNamespaces.set(namespace, new GlobalStyles<S>(
            styles,
            namespace
        ));
    }

    static getGlobalStyles(): IStyles<any>[] {
        return [...this.globalStylesNamespaces.values()];
    }
}
