import { CSSProperties } from 'react';
import { IPropertiesFactory } from '../Theme/Property/IPropertiesFactory';
import { IProperty } from '../Theme/Property/IProperty';

export interface IStylesObject<T = {}> {
    [key: string]: CSSProperties | IPropertiesFactory<T> | IStylesObject<T> | string | number | IProperty<any>
}
