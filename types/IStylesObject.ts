import { CSSProperties } from 'react';
import { IProperty } from './IProperty';

export interface IStylesObject {
    [key: string]: CSSProperties | IStylesObject | string | number | IProperty<any>
}
