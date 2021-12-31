import { IPropertyAdapter } from './IPropertyAdapter';

export class CssPropertyAdapter implements IPropertyAdapter {
    getNativePropertyGetter(name: string): string {
        return `var(--${name})`;
    }

    getNativePropertySetter(name: string, value: string): string {
        return `--${name}: ${value};`;
    }

    getNativePropertyName(name: string): string {
        return `--${name}`;
    }

    setPropertyValue(name: string, value: string): void {
        document.documentElement.style.setProperty(`--${name}`, value);
    }

    getPropertyValue(name: string): string {
        return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
    }
}
