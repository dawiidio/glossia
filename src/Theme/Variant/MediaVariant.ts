import { Variant } from './Variant';
import type { IBaseProperty } from '../../../types/IBaseProperty';

export class MediaVariant extends Variant {
    constructor(
        value: string,
        public mediaQuery: string,
        property?: IBaseProperty<any>,
    ) {
        super(value, property);
    }

    getKeyId(): string {
        return `${super.getKeyId()} ${this.mediaQuery}`;
    }
}
