import type { IProperty } from './IProperty';
import type { IVirtualProperty } from './IVirtualProperty';
import type { IRenderer } from './IRenderer';
import type { IPropertyAdapter } from './IPropertyAdapter';
import type { ITheme } from './ITheme';
import type { IVariant } from './IVariant';
import type { ICounter } from './ICounter';
import type { IPropertyWatcher } from './IPropertyWatcher';
import type { IStyles } from './IStyles';
import type { IStylesheet } from './IStylesheet';
import type { IRenderMode } from './IRenderMode';

export interface IRenderContext {
    renderedStaticStyles: Set<IStyles<any>>;
    themeStylesheet?: IStylesheet<any>;
    propertiesStylesheet?: IStylesheet<any>;
    properties: Map<string, IProperty<any>>;
    virtualProperties: Map<string, IVirtualProperty<any>>;
    virtualPropertyStorage: IPropertyAdapter;
    propertyWatchers: Map<IProperty<any> | IVirtualProperty<any>, Set<IPropertyWatcher>>;
    readonly id: number;
    readonly renderer: IRenderer;
    readonly counter: ICounter;
    readonly propertyAdapter: IPropertyAdapter;
    allProperties: Array<IProperty<any> | IVirtualProperty<any>>;
    themes: ITheme[];
    renderMode: IRenderMode;

    useStyles(styles: IStyles<any>): void;

    getStylesClassMapping(): Record<string, Record<string, string>>

    trigger(property: IProperty<any> | IVirtualProperty<any>, value: string): void;

    setPropertyValue(property: IProperty<any> | IVirtualProperty<any>, value: IVariant | string | number): void;

    getPropertyValue(property: IProperty<any> | IVirtualProperty<any>): string;

    watchProperty(property: IProperty<any> | IVirtualProperty<any>, callback: IPropertyWatcher): (() => void);

    renderThemingRelatedStylesheets(): void;

    isThemeRendered(theme: ITheme): any;

    toString(): any;

    destroy(): void;
}
