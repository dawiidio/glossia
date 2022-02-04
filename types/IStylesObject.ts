import { CSSProperties } from 'react';
import { IProperty } from './IProperty';
import { IVariant } from './IVariant';
import { IMediaVariantVariant } from './IMediaVariant';

export interface IStylesObject {
    [key: string]: CSSProperties | IStylesObject | string | number | IProperty<any> | IVariant | IMediaVariantVariant
}
