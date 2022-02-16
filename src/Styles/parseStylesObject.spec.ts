import { parseStylesObject } from './parseStylesObject';
import { IStylesObject } from '../../types/IStylesObject';
import { breakpoints } from '../testUtils';

function getTestStyles(): { styles: IStylesObject } {
    return {
        styles: {
            test: {
                color: 'red',
                [breakpoints.s]: {
                    width: '100%',
                },
                [breakpoints.l]: {
                    width: '20%',
                },
            },
            svg: {
                transform: 'translateY(-8px)',
                rect: {
                    height: '8px',
                },
                [breakpoints.l]: {
                    rect: {
                        height: '5px',
                    },
                },
            },
            '@keyframes slide-in': {
                from: {
                    transform: 'translateX(-100%)',
                },
                to: {
                    transform: 'translateX(0%)',
                },
            },
            [breakpoints.l]: {
                mySuperClass: {
                    boxSizing: 'border-box',
                },
            },
            [breakpoints.s]: {
                testCls: {
                    border: '1px solid black',
                },
            },
        },
    };
}

describe('parseStylesObject', () => {
    test('Should create basic styles for classes', () => {
        const { styles } = parseStylesObject(getTestStyles());

        expect(styles.hasOwnProperty('.test')).toBe(true);
        expect(styles.hasOwnProperty('.svg')).toBe(true);
        expect(styles.hasOwnProperty('.svg rect')).toBe(true);

        expect(styles['.test']).toStrictEqual({
            color: 'red',
        });

        expect(styles['.svg']).toStrictEqual({
            transform: 'translateY(-8px)',
        });

        expect(styles['.svg rect']).toStrictEqual({
            height: '8px',
        });
    });

    test('Should create keyframes styles (deprecated)', () => {
        const { styles } = parseStylesObject(getTestStyles());

        expect(styles.hasOwnProperty('@keyframes slide-in { from')).toBe(true);
        expect(styles.hasOwnProperty('@keyframes slide-in { to')).toBe(true);

        expect(styles['@keyframes slide-in { from']).toStrictEqual({
            transform: 'translateX(-100%)',
        });

        expect(styles['@keyframes slide-in { to']).toStrictEqual({
            transform: 'translateX(0%)',
        });
    });

    test('Should NOT add media rules to styles object', () => {
        const { styles } = parseStylesObject(getTestStyles());

        expect(Object.keys(styles).filter(x => x.startsWith('@media')).length).toEqual(0);
    });

    test('Should create class mapping for created classes', () => {
        const { stylesClassesMapping } = parseStylesObject(getTestStyles());

        expect(Object.keys(stylesClassesMapping).length).toEqual(2);

        expect(stylesClassesMapping.svg).toEqual('svg');
        expect(stylesClassesMapping.test).toEqual('test');
    });

    test('Should create media object with aggregated styles per media rule', () => {
        const { media } = parseStylesObject(getTestStyles());

        expect(media.hasOwnProperty(breakpoints.l)).toBe(true);
        expect(media.hasOwnProperty(breakpoints.s)).toBe(true);

        expect(Object.keys(media).length).toEqual(2);
        expect(Object.keys(media[breakpoints.l]).length).toEqual(3);
        expect(Object.keys(media[breakpoints.s]).length).toEqual(2);

        expect(media[breakpoints.l].hasOwnProperty('.test')).toBe(true);
        expect(media[breakpoints.l].hasOwnProperty('.svg rect')).toBe(true);
        expect(media[breakpoints.l].hasOwnProperty('.my-super-class')).toBe(true);

        expect(media[breakpoints.s].hasOwnProperty('.test')).toBe(true);
        expect(media[breakpoints.s].hasOwnProperty('.test-cls')).toBe(true);

        expect(media[breakpoints.l]['.test']).toStrictEqual({ width: '20%' });
        expect(media[breakpoints.l]['.svg rect']).toStrictEqual({ height: '5px' });
        expect(media[breakpoints.l]['.my-super-class']).toStrictEqual({ 'box-sizing': 'border-box' });

        expect(media[breakpoints.s]['.test']).toStrictEqual({ width: '100%' });
        expect(media[breakpoints.s]['.test-cls']).toStrictEqual({ border: '1px solid black' });
    });
});
