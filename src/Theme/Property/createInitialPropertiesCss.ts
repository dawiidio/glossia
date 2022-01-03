import { IProperty } from '../../../types/IProperty';
import { IFlatStylesObject } from '../../../types/IFlatStylesObject';
import { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import { IParsedStyles } from '../../../types/IParseStyles';

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
