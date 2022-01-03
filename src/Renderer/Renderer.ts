import { IRenderer } from '../../types/IRenderer';
import { IFlatStylesObject } from '../../types/IFlatStylesObject';

export abstract class Renderer implements IRenderer {
    protected allStyles = new Map<string, string>();

    render(styles: IFlatStylesObject): void {
        for (const [selector, stylesString] of Object.entries(styles)) {
            this.allStyles.set(selector, stylesString);
        }
    }

    clean(styles: IFlatStylesObject): void {
        for (const key of Object.keys(styles)) {
            this.allStyles.delete(key);
        }
    }

    toString(): string {
        return [...this.allStyles
            .entries()]
            .reduce((acc, [selector, styles]) => {
                return `${acc}\n${selector}\n${styles}`;
            }, '');
    }

    destroy() {
        this.allStyles.clear();
    }
}
