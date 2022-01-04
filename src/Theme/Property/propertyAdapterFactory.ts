import { InMemoryPropertyAdapter } from './InMemoryPropertyAdapter';
import { CssPropertyAdapter } from './CssPropertyAdapter';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';

export interface IPropertyAdapterOptions {
    ssr?: boolean;
}

export function propertyAdapterFactory({ ssr }: IPropertyAdapterOptions = {}): IPropertyAdapter {
    if (ssr)
        return new InMemoryPropertyAdapter();

    return new CssPropertyAdapter();
}
