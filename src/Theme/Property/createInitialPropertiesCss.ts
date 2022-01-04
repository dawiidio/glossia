import type { IProperty } from '../../../types/IProperty';
import type { IFlatStylesObject } from '../../../types/IFlatStylesObject';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import type { IParsedStyles } from '../../../types/IParseStyles';

export function createInitialPropertiesCss(properties: IProperty<any>[], propertyAdapter: IPropertyAdapter): IParsedStyles {
    let variables: IFlatStylesObject = {};

    for (const property of properties) {
        variables = {
            ...variables,
            ...property.toDefinitionObject(propertyAdapter),
            ...property.toVariantsDefinitionObject(propertyAdapter),
        };
    }

    return {
        ':root': variables,
    };
}
