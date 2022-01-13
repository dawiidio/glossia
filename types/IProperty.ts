import { IVariantsMap } from './IVariantsMap';
import { IBaseProperty } from './IBaseProperty';
import { IFlatStylesObject } from './IFlatStylesObject';
import { IPropertyAdapter } from './IPropertyAdapter';
import { IVariant } from './IVariant';

export interface IProperty<T extends IVariantsMap> extends IBaseProperty<T> {
    toDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject

    getVariantName(variant: IVariant): string
}
