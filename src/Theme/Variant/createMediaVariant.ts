import type { IProperty } from '../../../types/IProperty';
import { MediaVariant } from './MediaVariant';
import { IMediaVariant } from '../../../types/IMediaVariant';
import { IDefaultVariant } from '../../../types/IVariantsMap';

export function createMediaVariant(mediaQueries: IDefaultVariant, cssVar?: IProperty<any>): IMediaVariant {
    return new MediaVariant(mediaQueries, cssVar);
}
