import type { IVariant } from '../../types/IVariant';
import type { ITheme } from '../../types/ITheme';
import { extendVariantsMap } from '../common';
import { Theme } from './Theme';
import { IMediaVariantVariant } from '../../types/IMediaVariant';

export function createTheme(name: string, variants: Array<IVariant | IMediaVariantVariant>, parent?: ITheme): ITheme {
    let variantsMap = new Map<string, IVariant|IMediaVariantVariant>(variants.map(variant => {
        if (!variant.property)
            throw new Error('Theme level variant must points to its variable');

        return ([variant.getKeyId(), variant]);
    }));

    if (parent) {
        variantsMap = extendVariantsMap(variantsMap, parent.variants);
    }

    return new Theme(name, variantsMap);
}
