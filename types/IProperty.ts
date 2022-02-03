import { IVariantsMap } from './IVariantsMap';
import { IBaseProperty } from './IBaseProperty';
import { IPropertyAdapter } from './IPropertyAdapter';
import { IVariant } from './IVariant';
import { IMediaVariantVariant } from './IMediaVariant';
import { IStylesObject } from './IStylesObject';

export interface IProperty<T extends IVariantsMap> extends IBaseProperty<T> {
    toDefinitionObject(propertyAdapter: IPropertyAdapter): IStylesObject;

    toVariantsDefinitionObject(propertyAdapter: IPropertyAdapter): IStylesObject;

    getVariantName(variant: IVariant | IMediaVariantVariant): string;
}
