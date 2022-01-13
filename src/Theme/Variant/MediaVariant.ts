import { Variant } from './Variant';
import { IProperty } from '../../../types/IProperty';

export class MediaVariant extends Variant {
    constructor(
        value: string,
        public mediaQuery: string,
        property?: IProperty<any>,
    ) {
        super(value, property);
    }

    getKeyId(): string {
        return `${super.getKeyId()} ${this.mediaQuery}`;
    }
}
