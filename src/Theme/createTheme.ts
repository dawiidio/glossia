import { IVariant } from '../../types/IVariant';
import { ITheme } from '../../types/ITheme';
import { extendVariantsMap } from '../common';
import { Theme } from './Theme';

export function createTheme(name: string, variants: IVariant[], parent?: ITheme): ITheme {
    let variantsMap = new Map<string, IVariant>(variants.map(variant => {
        if (!variant.property)
            throw new Error('Theme level variant must points to its variable');

        return ([variant.getKeyId(), variant]);
    }));

    if (parent) {
        variantsMap = extendVariantsMap(variantsMap, parent.variants);
    }

    return new Theme(name, variantsMap);
}
