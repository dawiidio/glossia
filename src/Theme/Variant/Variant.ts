import { IVariant } from '../../../types/IVariant';
import { IBaseProperty } from '../../../types/IBaseProperty';

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
