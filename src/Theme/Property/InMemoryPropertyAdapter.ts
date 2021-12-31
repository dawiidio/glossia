import { IPropertyAdapter } from './IPropertyAdapter';

export class InMemoryPropertyAdapter implements IPropertyAdapter {
    private propertiesStorage = new Map<string, string>();

    getNativePropertyGetter(name: string): string {
        return `var(--${name})`;
    }

    getNativePropertyName(name: string): string {
        return `--${name}`;
    }

    getNativePropertySetter(name: string, value: string): string {
        return `--${name}: ${value};`;
    }

    setPropertyValue(name: string, value: string): void {
        this.propertiesStorage.set(`--${name}`, value);
    }

    getPropertyValue(name: string): string {
        return this.propertiesStorage.get(`--${name}`) || '';
    }

    clear() {
        this.propertiesStorage.clear();
    }
}
