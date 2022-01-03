import { IVariant } from '../../../types/IVariant';
import { IProperty } from '../../../types/IProperty';
import { Variant } from './Variant';

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant {
    return new Variant(value, cssVar);
}
