import type { IProperty } from '../../../types/IProperty';
import type { IVariantsMap } from '../../../types/IVariantsMap';
import { camelToKebabCase } from '../../common';
import { PropertiesSet } from './PropertiesSet';

export function createPropertiesSet<T extends IVariantsMap>(name: string, variants: T): IProperty<T> {
    return new PropertiesSet<T>(camelToKebabCase(name), variants);
}
