import { IProperty } from './IProperty';
import { IStaticStyles } from '../../Styles/IStaticStyles';
import { IFlatStylesObject } from '../../Styles/IFlatStylesObject';
import { IPropertyAdapter } from './IPropertyAdapter';

export function createInitialPropertiesCss(properties: IProperty<any>[], propertyAdapter: IPropertyAdapter): IStaticStyles {
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
