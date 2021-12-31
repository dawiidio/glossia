import { IVariant } from './IVariant';
import { IBaseProperty } from '../Property/IBaseProperty';

export class Variant implements IVariant {
    constructor(
        public readonly value: string,
        public readonly property?: IBaseProperty<any>,
    ) {}

    getKeyId(): string {
        if (this.property)
            return this.property?.name;

        return '';
    }

    toString() {
        return this.value;
    }
}
