import { IVariant } from './IVariant';
import { IProperty } from '../Property/IProperty';
import { Variant } from './Variant';

export function createVariant(value: string, cssVar?: IProperty<any>): IVariant {
    return new Variant(value, cssVar);
}
