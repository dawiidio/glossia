import { Stylesheet } from '../Styles/Stylesheet';
import { IProperty } from '../Theme/Property/IProperty';
import { IVirtualProperty } from '../Theme/Property/IVirtualProperty';
import { InMemoryPropertyAdapter } from '../Theme/Property/InMemoryPropertyAdapter';
import { IRenderer } from '../Renderer/IRenderer';
import { Counter } from '../Counter/Counter';
import { IPropertyAdapter } from '../Theme/Property/IPropertyAdapter';
import { ITheme } from '../Theme/ITheme';
import { isProperty, isVirtualProperty, mergeThemesStylesObjects } from '../common';
import { IVariant } from '../Theme/Variant/IVariant';
import { createInitialPropertiesCss } from '../Theme/Property/createInitialPropertiesCss';
import { StaticStyles } from './StaticStyles';

export type PropertyWatcher = (value: string) => void;

export class RenderContext {
    private readonly renderedStaticStyles = new Set<StaticStyles>();
    private themeStylesheet?: Stylesheet<any>;
    private propertiesStylesheet?: Stylesheet<any>;
    private readonly properties = new Map<string, IProperty<any>>();
    private readonly virtualProperties = new Map<string, IVirtualProperty<any>>();
    private readonly virtualPropertyStorage = new InMemoryPropertyAdapter();
    private readonly propertyWatchers = new Map<IProperty<any>|IVirtualProperty<any>, Set<PropertyWatcher>>();

    constructor(
        public readonly id: number,
        public readonly renderer: IRenderer,
        public readonly counter: Counter,
        public readonly propertyAdapter: IPropertyAdapter,
        public allProperties: Array<IProperty<any> | IVirtualProperty<any>>,
        public themes: ITheme[],
        public readonly ssr: boolean
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

        this.renderThemingRelatedStylesheets();
    }

    useStaticStyles(staticStyles: StaticStyles) {
        if (this.renderedStaticStyles.has(staticStyles))
            return;

        this.renderedStaticStyles.add(staticStyles);
        this.renderer.render(staticStyles.stylesheet.parsedStaticStyles);
    }

    private trigger(property: IProperty<any> | IVirtualProperty<any>, value: string) {
        [...(this.propertyWatchers.get(property)?.values() || [])].forEach(cb => cb(value));
    }

    setPropertyValue(property: IProperty<any> | IVirtualProperty<any>, value: IVariant|string|number): void {
        if (isProperty(property)) {
            this.propertyAdapter.setPropertyValue(property.name, String(value));

            this.trigger(property, String(value));
            return;
        }
        else if (isVirtualProperty(property)) {
            this.virtualPropertyStorage.setPropertyValue(property.name, String(value));

            this.trigger(property, String(value));
            return;
        }

        throw new Error(`Unknown property type`);
    }

    getPropertyValue(property: IProperty<any> | IVirtualProperty<any>): string {
        if (isProperty(property)) {
            return this.propertyAdapter.getPropertyValue(property.name);
        }
        else if (isVirtualProperty(property)) {
            return this.virtualPropertyStorage.getPropertyValue(property.name);
        }

        throw new Error(`Unknown property type`);
    }

    watchProperty(property: IProperty<any>|IVirtualProperty<any>, callback: PropertyWatcher): (() => void) {
        if (!this.propertyWatchers.has(property)) {
            this.propertyWatchers.set(property, new Set<PropertyWatcher>());
        }

        this.propertyWatchers.get(property)?.add(callback);

        return () => {
            this.propertyWatchers.get(property)?.delete(callback);
        }
    }

    renderThemingRelatedStylesheets() {
        this.propertiesStylesheet = new Stylesheet<any>(createInitialPropertiesCss([...this.properties.values()], this.propertyAdapter));
        this.themeStylesheet = new Stylesheet<any>(mergeThemesStylesObjects(this.themes));
        this.renderer.render({
            ...this.propertiesStylesheet.parsedStaticStyles,
            ...this.themeStylesheet.parsedStaticStyles,
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
        this.themeStylesheet?.destroy();
        this.propertiesStylesheet?.destroy();
        this.properties.clear();
        this.renderedStaticStyles.clear();
        this.allProperties = [];
        this.themes = [];
        this.virtualProperties.clear();
        this.virtualPropertyStorage.clear();

        if (this.ssr)
            this.renderer.destroy();
    }
}
