import { IStaticStyles } from './IParseStyles';
import { IStylesObject } from './IStylesObject';
import { IFlatStylesObject } from './IFlatStylesObject';
import { IRuleInterceptor } from './IRuleInterceptor';
import { parseStylesObject } from './parseStylesObject';
import { fixMediaRules } from '../common';

export class Stylesheet<T> {
    staticStyles: IStaticStyles = {};
    dynamicStyles: IStylesObject<T>;
    staticClassesMapping: Record<string, string> = {};
    parsedStaticStyles: IFlatStylesObject = {};

    constructor(styles: IStylesObject<T>, ruleInterceptor?: IRuleInterceptor) {
        const {
            staticStyles, dynamicStyles, staticClassesMapping,
        } = parseStylesObject({
            styles,
            ruleInterceptor,
        });

        this.dynamicStyles = dynamicStyles;
        this.staticStyles = staticStyles;
        this.staticClassesMapping = staticClassesMapping;
        this.parsedStaticStyles = fixMediaRules(this.staticStyles);
    }

    parseDynamicStyles(props: T, ruleInterceptor?: IRuleInterceptor): { styles: IStaticStyles, classesMapping: Record<string, string>, parsedStyles: Record<string, string> } {
        if (!this.dynamicStyles)
            throw new Error(`Styles not parsed yet`);

        const { staticStyles, staticClassesMapping } = parseStylesObject({
            styles: this.dynamicStyles,
            ruleInterceptor,
            preprocessed: true,
            props,
        });

        return {
            styles: staticStyles,
            classesMapping: staticClassesMapping,
            parsedStyles: fixMediaRules(staticStyles),
        };
    }

    mergeWithStaticClassesMapping(classesMapping: Record<string, string>) {
        return {
            ...this.staticClassesMapping,
            ...classesMapping,
        };
    }

    destroy() {
        this.dynamicStyles = {};
        this.staticStyles = {};
        this.parsedStaticStyles = {};
        this.staticClassesMapping = {};
    }
}
