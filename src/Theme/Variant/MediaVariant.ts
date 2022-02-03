import type { IProperty } from '../../../types/IProperty';
import type { IMediaVariantVariant } from '../../../types/IMediaVariant';
import { IDefaultVariant } from '../../../types/IVariantsMap';

export class MediaVariant implements IMediaVariantVariant {
    constructor(
        public mediaQueries: IDefaultVariant,
        public property?: IProperty<any>,
    ) {
    }

    getKeyId(): string {
        if (this.property)
            return this.property.name;

        return '';
    }
}
