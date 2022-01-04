import type { IProperty } from '../../../types/IProperty';
import type { IDefaultVariant } from '../../../types/IVariantsMap';
import { Property } from './Property';

export function createProperty<T extends IDefaultVariant>(name: string, variants: T): IProperty<T> {
    return new Property<T>(name, variants);
}
