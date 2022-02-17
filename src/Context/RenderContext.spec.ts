import { RenderContext } from './RenderContext';
import { rendererFactory } from '../Renderer/rendererFactory';
import { counterFactory } from '../Counter/counterFactory';
import { getId } from '../common';
import { propertyAdapterFactory } from '../Theme/Property/propertyAdapterFactory';
import { breakpoints, createTestPropertiesAndThemes } from '../testUtils';
import { Styles } from './Styles';

const getContext = () => {
    const ssr = true;

    const ctxId = getId();

    const renderer = rendererFactory({
        ssr,
        elementId: 'test',
        attributes: {},
    });

    const counter = counterFactory({
        ssr,
    });

    const propertyAdapter = propertyAdapterFactory({
        ssr,
    });

    const {
        properties, themes,
    } = createTestPropertiesAndThemes();

    return new RenderContext(
        ctxId,
        renderer,
        counter,
        propertyAdapter,
        properties,
        themes,
        'ssr',
        {},
    );
};

describe('RenderContext', () => {
    test('Should merge media rules from user styles with those created for properties internally', () => {
        const ctx = getContext();

        ctx.useStyles(new Styles<any>({
            [breakpoints.l]: {
                testCls: {
                    width: '100%',
                },
            },
        }, 'namespace'));

        const stylesStr = ctx.renderer.allStyles.get(breakpoints.l + ' {');

        expect(typeof stylesStr).toEqual('string');
        expect((stylesStr || '').includes('.test-cls')).toBe(true);
        expect((stylesStr || '').includes(':root')).toBe(true);
        expect((stylesStr || '').includes('--background-default:blue;')).toBe(true);
    });

    test('Should merge different media rules without loosing any', () => {
        const ctx = getContext();

        ctx.useStyles(new Styles<any>({
            testCls: {
                width: '50%',
                [breakpoints.l]: {
                    width: '88%',
                },
            },
            [breakpoints.xl]: {
                testCls2: {
                    width: '100%',
                },
            },
            [breakpoints.s]: {
                testCls3: {
                    width: '100%',
                },
            },
        }, 'namespace'));

        const stylesStrL = ctx.renderer.allStyles.get(breakpoints.l + ' {');
        const stylesStrXL = ctx.renderer.allStyles.get(breakpoints.xl + ' {');
        const stylesStrS = ctx.renderer.allStyles.get(breakpoints.s + ' {');

        expect(typeof stylesStrL).toEqual('string');
        expect(typeof stylesStrXL).toEqual('string');
        expect(typeof stylesStrS).toEqual('string');
    });

    test('Should render media rules at the end when lastly added styles caused update of aggregated earlier media rule', () => {
        const ctx = getContext();

        ctx.useStyles(new Styles<any>({
            testCls: {
                width: '50%',
                [breakpoints.l]: {
                    width: '88%',
                },
            },
        }, 'namespace'));

        const keys = [...ctx.renderer.allStyles.keys()];
        const indexOfTargetCls = keys.indexOf('.namespace_test-cls');
        // because media rules should be pushed always after normal styles we check if next in styles after adding our class with rules stands media rule
        const indexOfNextRule = indexOfTargetCls+1;

        expect(keys[indexOfNextRule]).toEqual(breakpoints.l+' {');
    });
});
