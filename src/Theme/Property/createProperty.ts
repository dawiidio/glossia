import { IProperty } from './IProperty';
import { IDefaultVariant } from '../Variant/IVariantsMap';
import { Property } from './Property';

export function createProperty<T extends IDefaultVariant>(name: string, variants: T): IProperty<T> {
    return new Property<T>(name, variants);
}
