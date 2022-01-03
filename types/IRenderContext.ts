import { IProperty } from './IProperty';
import { Styles } from '../src/Context/Styles';
import { Stylesheet } from '../src/Styles/Stylesheet';
import { IVirtualProperty } from './IVirtualProperty';
import { InMemoryPropertyAdapter } from '../src/Theme/Property/InMemoryPropertyAdapter';
import { IRenderer } from './IRenderer';
import { IPropertyAdapter } from './IPropertyAdapter';
import { ITheme } from './ITheme';
import { IVariant } from './IVariant';
import { ICounter } from './ICounter';
import { IPropertyWatcher } from './IPropertyWatcher';

export interface IRenderContext {
    renderedStaticStyles: Set<Styles<any>>;
    themeStylesheet?: Stylesheet<any>;
    propertiesStylesheet?: Stylesheet<any>;
    properties: Map<string, IProperty<any>>;
    virtualProperties: Map<string, IVirtualProperty<any>>;
    virtualPropertyStorage: InMemoryPropertyAdapter;
    propertyWatchers: Map<IProperty<any> | IVirtualProperty<any>, Set<IPropertyWatcher>>;
    readonly id: number;
    readonly renderer: IRenderer;
    readonly counter: ICounter;
    readonly propertyAdapter: IPropertyAdapter;
    allProperties: Array<IProperty<any> | IVirtualProperty<any>>;
    themes: ITheme[];
    readonly ssr: boolean;

    useStyles(styles: Styles<any>): void;

    trigger(property: IProperty<any> | IVirtualProperty<any>, value: string): void;

    setPropertyValue(property: IProperty<any> | IVirtualProperty<any>, value: IVariant | string | number): void;

    getPropertyValue(property: IProperty<any> | IVirtualProperty<any>): string;

    watchProperty(property: IProperty<any> | IVirtualProperty<any>, callback: IPropertyWatcher): (() => void);

    renderThemingRelatedStylesheets(): void;

    isThemeRendered(theme: ITheme): any;

    toString(): any;

    destroy(): void;
}
