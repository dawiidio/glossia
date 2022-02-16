import { BaseProperty } from './BaseProperty';
import { createMediaVariant } from '../Variant/createMediaVariant';
import { createVariant } from '../Variant/createVariant';
import { propertyAdapterFactory } from './propertyAdapterFactory';

describe('BaseProperty', () => {
    test('Should create property definition object', () => {
        const property = new BaseProperty('property', {
            default: createMediaVariant({
                default: createVariant('100%'),
                '@media all and (min-width: 1200px)': createVariant('1000px'),
            }),
        });

        expect(property.toDefinitionObject(propertyAdapterFactory())).toStrictEqual({
            '--property': 'var(--property-default)'
        });
    });

    test('Should create property variants definition object for default media variant', () => {
        const property = new BaseProperty('property', {
            default: createMediaVariant({
                default: createVariant('100%'),
                '@media all and (min-width: 1200px)': createVariant('1000px'),
            }),
        });

        expect(property.toVariantsDefinitionObject(propertyAdapterFactory())).toStrictEqual({
            '--property-default': '100%',
            '@media all and (min-width: 1200px)': { '--property-default': '1000px' }
        });
    });

    test('Should create property variants definition object', () => {
        const property = new BaseProperty('property', {
            default: createVariant('100%'),
            val: createVariant('50%'),
        });

        expect(property.toVariantsDefinitionObject(propertyAdapterFactory())).toStrictEqual({
            '--property-default': '100%',
            '--property-val': '50%',
        });
    });
});
