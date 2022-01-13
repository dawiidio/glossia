import { CSSProperties } from 'react';
import { IProperty } from './IProperty';
import { IVariant } from './IVariant';

export interface IStylesObject {
    [key: string]: CSSProperties | IStylesObject | string | number | IProperty<any> | IVariant
}
