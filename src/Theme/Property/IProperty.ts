import { IVariantsMap } from '../Variant/IVariantsMap';
import { IBaseProperty } from './IBaseProperty';
import { IFlatStylesObject } from '../../Styles/IFlatStylesObject';
import { IPropertyAdapter } from './IPropertyAdapter';

export interface IProperty<T extends IVariantsMap> extends IBaseProperty<T> {
    toDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IFlatStylesObject
}
