import { CSSProperties } from 'react';
import { IProperty } from './IProperty';
import { IVariant } from './IVariant';
import { IMediaVariant } from './IMediaVariant';

export interface IStylesObject {
    [key: string]: CSSProperties | IStylesObject | string | number | IProperty<any> | IVariant | IMediaVariant
}
