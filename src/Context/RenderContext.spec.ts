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
        properties, themes
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
}

describe('RenderContext', () => {
    test('Should merge media rules from user styles with those created for properties internally', () => {
        const ctx = getContext();

        ctx.useStyles(new Styles<any>({
            [breakpoints.l]: {
                testCls: {
                    width: '100%'
                }
            }
        }, 'namespace'));

        const stylesStr = ctx.renderer.allStyles.get(breakpoints.l+' {');

        expect(typeof stylesStr).toEqual('string');
        expect((stylesStr || '').includes('.test-cls')).toBe(true);
        expect((stylesStr || '').includes(':root')).toBe(true);
        expect((stylesStr || '').includes('--background-default:blue;')).toBe(true);
    });
});
