import type { IVariant } from '../../../types/IVariant';
import { camelToKebabCase } from '../../common';
import { IProperty } from '../../../types/IProperty';

export class Variant implements IVariant {
    constructor(
        public readonly value: string,
        public readonly property?: IProperty<any>,
    ) {}

    getKeyId(): string {
        if (this.property)
            return this.property?.name;

        return '';
    }

    toString() {
        if (this.property) {
            return `var(--${this.property.name}-${camelToKebabCase(this.property.getVariantName(this))})`;
        }

        return this.value;
    }
}
