import type { IVariant } from '../../../types/IVariant';
import type { IProperty } from '../../../types/IProperty';
import { Variant } from './Variant';

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant {
    return new Variant(value, cssVar);
}
