import { IStylesObject } from '../../types/IStylesObject';
import { GlossiaContextManager } from '../Context/GlossiaContextManager';
import { GLOBAL_NAMESPACE } from '../common';

export function createGlobalStyles(namespace: string, styles: IStylesObject): void {
    GlossiaContextManager.createGlobalStyles(`${GLOBAL_NAMESPACE}_${namespace}`, styles);
}
