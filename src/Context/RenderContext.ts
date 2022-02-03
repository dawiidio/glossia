import { stylesheetFactory } from '../Styles/stylesheetFactory';
import type { IProperty } from '../../types/IProperty';
import type { IVirtualProperty } from '../../types/IVirtualProperty';
import { InMemoryPropertyAdapter } from '../Theme/Property/InMemoryPropertyAdapter';
import type { IRenderer } from '../../types/IRenderer';
import { Counter } from '../Counter/Counter';
import type { IPropertyAdapter } from '../../types/IPropertyAdapter';
import type { ITheme } from '../../types/ITheme';
import {
    isHydrationMode,
    isProperty,
    isSSRMode,
    isVirtualProperty, mergeManyIStylesObjects,
    mergeThemesStylesObjects,
} from '../common';
import type { IVariant } from '../../types/IVariant';
import { createPropertiesCss } from '../Theme/Property/createPropertiesCss';
import { Styles } from './Styles';
import type { IRenderContext } from '../../types/IRenderContext';
import type { IPropertyWatcher } from '../../types/IPropertyWatcher';
import type { IRenderMode } from '../../types/IRenderMode';
import type { IStylesheet } from '../../types/IStylesheet';
import { GlossiaContextManager } from './GlossiaContextManager';

export class RenderContext implements IRenderContext {
    readonly renderedStaticStyles = new Set<Styles<any>>();
    internalGlobalStylesheet?: IStylesheet<any>;
    propertiesStylesheet?: IStylesheet<any>;
    readonly properties = new Map<string, IProperty<any>>();
    readonly virtualProperties = new Map<string, IVirtualProperty<any>>();
    readonly virtualPropertyStorage = new InMemoryPropertyAdapter();
    readonly propertyWatchers = new Map<IProperty<any> | IVirtualProperty<any>, Set<IPropertyWatcher>>();

    constructor(
        readonly id: number,
        readonly renderer: IRenderer,
        readonly counter: Counter,
        readonly propertyAdapter: IPropertyAdapter,
        public allProperties: Array<IProperty<any> | IVirtualProperty<any>>,
        public themes: ITheme[],
        readonly renderMode: IRenderMode,
        private readonly renderedNamespacesClassMapping: Record<string, Record<string, string>>,
        private readonly developmentMode: boolean = false,
    ) {
        for (const property of this.allProperties) {
            if (isProperty(property)) {
                if (this.properties.has(property.name))
                    throw new Error(`Property with name "${property.name}" found twice`);

                this.properties.set(property.name, property);
                continue;
            }

            if (this.virtualProperties.has(property.name))
                throw new Error(`Virtual property with name "${property.name}" found twice`);

            this.virtualProperties.set(property.name, property);
        }

        this.renderGlobalStylesheets();
    }

    useStyles(styles: Styles<any>) {
        if (!this.developmentMode) { // in development mode style may be overwritten
            if (this.renderedNamespacesClassMapping[styles.namespace])
                return;

            if (this.renderedStaticStyles.has(styles))
                return;
        }

        this.renderedStaticStyles.add(styles);
        this.renderer.render(styles.stylesheet.parsedStyles);
    }

    getStylesClassMapping(): Record<string, Record<string, string>> {
        return [...this.renderedStaticStyles].reduce((acc, s) => ({
            ...acc,
            [s.namespace]: s.stylesheet.stylesClassesMapping,
        }), {});
    }

    trigger(property: IProperty<any> | IVirtualProperty<any>, value: string) {
        [...(this.propertyWatchers.get(property)?.values() || [])].forEach(cb => cb(value));
    }

    setPropertyValue(property: IProperty<any> | IVirtualProperty<any>, value: IVariant | string | number): void {
        if (isProperty(property)) {
            this.propertyAdapter.setPropertyValue(property.name, String(value));

            this.trigger(property, String(value));
            return;
        } else if (isVirtualProperty(property)) {
            this.virtualPropertyStorage.setPropertyValue(property.name, String(value));

            this.trigger(property, String(value));
            return;
        }

        throw new Error(`Unknown property type`);
    }

    getPropertyValue(property: IProperty<any> | IVirtualProperty<any>): string {
        if (isProperty(property)) {
            return this.propertyAdapter.getPropertyValue(property.name);
        } else if (isVirtualProperty(property)) {
            return this.virtualPropertyStorage.getPropertyValue(property.name);
        }

        throw new Error(`Unknown property type`);
    }

    watchProperty(property: IProperty<any> | IVirtualProperty<any>, callback: IPropertyWatcher): (() => void) {
        if (!this.propertyWatchers.has(property)) {
            this.propertyWatchers.set(property, new Set<IPropertyWatcher>());
        }

        this.propertyWatchers.get(property)?.add(callback);

        return () => {
            this.propertyWatchers.get(property)?.delete(callback);
        };
    }

    renderGlobalStylesheets() {
        this.internalGlobalStylesheet = stylesheetFactory<any>({
            stylesObject: mergeManyIStylesObjects(
                mergeThemesStylesObjects(this.themes, this.propertyAdapter),
                createPropertiesCss([...this.properties.values()], this.propertyAdapter),
            ),
            disableStylesParsing: isHydrationMode(this.renderMode),
            type: 'template',
        });

        this.renderer.render({
            ...this.internalGlobalStylesheet.parsedStyles,
            ...GlossiaContextManager.getGlobalStyles().reduce((acc, s) => ({
                ...acc,
                ...s.stylesheet.parsedStyles,
            }), {}),
        });
    }

    isThemeRendered(theme: ITheme) {
        return this.themes.includes(theme);
    }

    toString() {
        return this.renderer.toString();
    }

    destroy() {
        this.propertyWatchers.clear();
        this.counter.destroy();
        this.internalGlobalStylesheet?.destroy();
        this.propertiesStylesheet?.destroy();
        this.properties.clear();
        this.renderedStaticStyles.clear();
        this.allProperties = [];
        this.themes = [];
        this.virtualProperties.clear();
        this.virtualPropertyStorage.clear();

        if (isSSRMode(this.renderMode))
            this.renderer.destroy();
    }
}
