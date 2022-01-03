export interface IPropertyAdapter {
    getNativePropertyGetter(name: string): string
    getNativePropertySetter(name: string, value: string): string
    getNativePropertyName(name: string): string
    setPropertyValue(name: string, value: string): void
    getPropertyValue(name: string): string
}
