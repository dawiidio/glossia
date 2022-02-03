import type { IProperty } from '../../../types/IProperty';
import { MediaVariant } from './MediaVariant';
import { IMediaVariantVariant } from '../../../types/IMediaVariant';
import { IDefaultVariant } from '../../../types/IVariantsMap';

export function createMediaVariant(mediaQueries: IDefaultVariant, cssVar?: IProperty<any>): IMediaVariantVariant {
    return new MediaVariant(mediaQueries, cssVar);
}
