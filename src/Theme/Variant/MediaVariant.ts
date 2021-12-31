import { Variant } from './Variant';
import { IBaseProperty } from '../Property/IBaseProperty';

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
