import { IBaseProperty } from './IBaseProperty';

export interface IVariant {
    property?: IBaseProperty<any>
    mediaQuery?: string
    value: string

    getKeyId(): string
}
