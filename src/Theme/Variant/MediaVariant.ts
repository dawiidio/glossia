import type { IProperty } from '../../../types/IProperty';
import type { IMediaVariantVariant } from '../../../types/IMediaVariant';
import { IDefaultVariant } from '../../../types/IVariantsMap';
import { camelToKebabCase } from '../../common';

export class MediaVariant implements IMediaVariantVariant {
    constructor(
        public mediaQueries: IDefaultVariant,
        public property?: IProperty<any>,
    ) {
    }

    getKeyId(): string {
        if (this.property)
            return this.property.name;

        return `${Math.round(Math.random()*1e4)}`;
    }

    toString() {
        return `var(--${this.property?.name}-${camelToKebabCase(this.property?.getVariantName(this) || '')})`;
    }
}
