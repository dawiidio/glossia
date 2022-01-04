import type { IVariant } from '../../../types/IVariant';
import type { IProperty } from '../../../types/IProperty';
import { MediaVariant } from './MediaVariant';

export function createMediaVariant(value: string, mediaQuery: string | IVariant, cssVar?: IProperty<any>): IVariant {
    const val: string = typeof mediaQuery === 'string' ? mediaQuery : String(mediaQuery.value);

    return new MediaVariant(value, val, cssVar);
}
