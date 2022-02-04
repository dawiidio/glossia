import type { IProperty } from '../../../types/IProperty';
import type { IDefaultVariant } from '../../../types/IVariantsMap';
import { BaseProperty } from './BaseProperty';

export class Property<T extends IDefaultVariant> extends BaseProperty<T> implements IProperty<T> {}
