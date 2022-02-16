import { IProperty } from '../../../types/IProperty';
import { BaseProperty } from './BaseProperty';

export function isProperty(property: object | string | number): property is IProperty<any> {
    return property instanceof BaseProperty;
}
