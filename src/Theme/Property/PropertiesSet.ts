import type { IProperty } from '../../../types/IProperty';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import type { IVariantsMap } from '../../../types/IVariantsMap';
import type { IStylesObject } from '../../../types/IStylesObject';
import { BaseProperty } from './BaseProperty';

export class PropertiesSet<T extends IVariantsMap> extends BaseProperty<T> implements IProperty<T> {
    toDefinitionObject(propertyAdapter: IPropertyAdapter): IStylesObject {
        return {};
    }

    toString() {
        throw new Error(`PropertiesSet can not be accessed by reference`);
        return '';
    }
}
