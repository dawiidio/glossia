import type { IProperty } from './IProperty';

export interface IVariant {
    property?: IProperty<any>
    mediaQuery?: string
    value: string

    getKeyId(): string
}
