import { StringRenderer } from './StringRenderer';

describe('Renderer (StringRenderer)', () => {
    test('Should add updated styles at the end', () => {
        const renderer = new StringRenderer({
            elementId: 'test'
        })

        renderer.render({
            '.test {': 'color: red; }'
        });

        renderer.render({
            '.xyz {': 'color: blue; }',
            '.abc {': 'color: blue; }',
        });

        renderer.render({
            '.test {': 'color: blue; }'
        });

        const keys = [...renderer.allStyles.keys()];

        expect(keys[keys.length-1]).toEqual('.test {');
    });
});
