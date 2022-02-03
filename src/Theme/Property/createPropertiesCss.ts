import type { IProperty } from '../../../types/IProperty';
import type { IPropertyAdapter } from '../../../types/IPropertyAdapter';
import { IStylesObject } from '../../../types/IStylesObject';

export function createPropertiesCss(properties: IProperty<any>[], propertyAdapter: IPropertyAdapter, scope: string = ':root'): IStylesObject {
    let variables: IStylesObject = {};
    const mediaMap: IStylesObject = {};

    for (const property of properties) {

        for (const [key, val] of Object.entries(property.toVariantsDefinitionObject(propertyAdapter))) {
            if (key.startsWith('@media')) {
                if (!mediaMap[key])
                    mediaMap[key] = {};

                mediaMap[key] = {
                    ...(mediaMap[key] as {}),
                    ...(val as {})
                };

                continue;
            }

            variables[key] = val;
        }

        variables = {
            ...variables,
            ...property.toDefinitionObject(propertyAdapter),
        };
    }

    return {
        [scope]: {
            ...variables,
            ...mediaMap
        },
    };
}
