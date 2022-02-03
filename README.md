# Glossia

Glossia is a shortcut for latin "*Glossostigma elatinoides*"
which is a small underwater plant, as its role model plant Glossia is a small solution for styling React components and
theming web applications, with built-in support for SSR and hydration modes whereby it remains almost 0 dependency lib.

Glossia in configuration like this: hydration mode on client side and rendered in SSR mode is zero-runtime styling
solution on client side. There are also plans for Glossia build step which will make it zero client runtime without SSR,
it will even remove redundant at this point declarations to minimize bundle size.

I build it for blog because I wanted something more integrated with native CSS. All Glossia theming system is based on
pure CSS properties and classes which is its real superpower. Apart from the above Glossia has no explicit dependencies
expect React and Typescript what makes it small and safe for use.

## Installation

```shell
npm i -S glossia

# or

yarn add glossia
```

## Setup

Basic setup

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GlossiaContextManager, GlossiaContextProvider } from 'glossia';

const glossiaContext = GlossiaContextManager.createContext();

ReactDOM.render(
    <React.StrictMode>
        <GlossiaContextProvider value={glossiaContext}>
            <App />
        </GlossiaContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
```

Glossia has a well-known api similar to the jss library:

## Components styling

```tsx
import { createUseStyles } from 'glossia';

const useStyles = createUseStyles('namespace', {
    testGreen: {
        backgroundColor: 'green',
    },
    testRed: {
        backgroundColor: 'red',
    },
    activeSquare: {
        backgroundColor: 'blue',
    },
    squareDiv: {
        backgroundColor: 'red',
        width: '100px',
        height: '100px',
        margin: '10px',
        float: 'left',
        transition: 'all 300ms'
    },
    myParagraph: {
        fontSize: '12px',
        '& > .special-text': {
            color: 'purple'
        }
    },
    testAnimation: {
        animation: 'slide-in 1000ms',
    },
    '@keyframes slide-in': {
        from: {
            transform: 'translateX(-100%)'
        },
        to: {
            transform: 'translateX(0%)'
        }
    }
});

function App() {
    const [val, setVal] = useState<number>(0);
    const {
        join,
        activeSquare,
        testRed,
        testGreen,
        squareDiv,
        myParagraph,
        testAnimation
    } = useStyles();
    const [arr, setArr] = useState<number[]>([0, 1, 2, 3, 4]);

    const isActive = (id: number): boolean => {
        //... some logic
        return true;
    };

    return (
        <div>
            <div className={join(val % 2 ? testGreen : testRed)}>
                Lorem ipsum dolor sit amet.
                <button onClick={() => setVal(x => x + 1)}>change color</button>
            </div>
            {arr.map(num => (<div key={num} className={join(squareDiv, activeSquare(isActive(num)))}>
                Number: {num}
            </div>))}
            <p className={join(myParagraph)}>
                Lorem ipsum dolor sit amet.
                <span>Lorem ipsum dolor sit.</span>
                <span className="special-text">Lorem ipsum dolor sit amet.</span>
            </p>
            <h1 className={join(testAnimation)}>
                Lorem ipsum dolor sit amet.
            </h1>
        </div>
    );
}
```

### Global styles

You can also create global styles like this:

```tsx
export const fontFamily = createProperty('fontFamily', {
    default: createVariant(`'Lato', sans-serif`),
});

createGlobalStyles('global-styles', {
    body: {
        margin: '0',
        padding: '0',
        fontFamily: fontFamily
    }
});
```

as you can see above, properties are also allowed in global styles

## Theming

Glossia theming system is completely based on native CSS. It only gives you nice JS api to work with CSS variables and
classes. Themes are composed of variants which are building blocks. You can think about it like this: property is
variable to which you can assign variant, variant is value you assign to property. Themes are sets of variants, when you
activate theme it assigns it's variants to corresponding properties.

### Variants

Variants are base building blocks, they are atomic values which you can assign to properties and combine in different
ways using themes For every variant assigned to property will be created corresponding CSS variable (but only when
variant is assigned to property!).

Note: Variant must contain valid CSS value

You can create variant like this:

```tsx
const myVariant = createVariant('#fff'); // for this hanging variant css variable will not be created

const bg = createProperty('bg-color', {
    default: createVariant('white'), // for this variant css variable will be created 
});

// Note this: 
const mySecondVariant = createVariant('#fff');

const bg1 = createProperty('bg-color1', {
    default: mySecondVariant, // for every usage of hanging variant in property will be created separated CSS variable in property scope
});

const bg2 = createProperty('bg-color2', {
    default: mySecondVariant,
});
```

worth of note is also fact that you can create variant for any property dynamically like this:

```tsx
createVariant('#000', bg)
```

but above notation will not create new variable, it will overwrite value for property only in theme scope.

### Media Variants
Media variants are variants with additional media rules

```tsx
export const breakpoints = {
    l: 'all and (min-width: 1200px)',
};

export const test = createProperty('test', {
    default: createMediaVariant({
        default: createVariant('pink'),
        [breakpoints.l]: createVariant('blue'), // if screen wider than 1200px then set variable to blue
    }),
});

// Media variant can be used in theme
export const theme = createTheme('theme', [
    createMediaVariant({
        default: createVariant('green'), 
        [breakpoints.l]: createVariant('yellow'),
    }, test),
]);

// Media variant can be overriden by normal variant, in this case variable will be always red 
export const theme = createTheme('theme', [
    createVariant('red', test),
]);
```

### Properties

Property is variable to which you can assign value (variant) then you can use property in styles and it will track
changes. When property value changes styles follows without rerenders because property is just a CSS variable

Property may be used directly in styles like this:

```tsx
const bg = createProperty('bg-color', {
    default: createVariant('white'),
    secondary: createVariant('green'),
});

const useStyles = createUseStyles('namespace', {
    test: {
        backgroundColor: bg,
    }
});
```

above example will be later translated to CSS like this:

```css
:root {
    --bg-color-default: 'white';
    --bg-color-secondary: 'green';
    --bg-color: var(--bg-color-default);
}

.test {
    background-color: var(--bg-color);
}
```

if variant for property changes it switches value only for base CSS variable. For example if secondary variant would be
activated than CSS changes like this:

```css
:root {
    --bg-color-default: 'white';
    --bg-color-secondary: 'green';
    --bg-color: var(--bg-color-secondary);
}
```

You can also use variants from others properties like this:

```tsx
export const primaryColor = createProperty('primary-color', {
    default: createVariant('white'),
    secondary: createVariant('red'),
});

export const bg = createProperty('bg-color', {
    default: primaryColor.variants.default, // this notation do not create new variable it assign variant variable to this property variable
});
```

above example generates CSS:

```css
:root {
    --primary-color-default: 'white';
    --primary-color-secondary: 'red';
    --primary-color: var(--bg-color-default);

    --bg-color-default: var(--primary-color-default);
    --bg-color: var(--bg-color-default);
}
```

Another interesting case about properties and variants is that you can use variant as property once it was assigned to
property. So for example you want to create text with secondary font but this font will not change across themes, so you
can simply use variant from property in styles:

```tsx
export const fontFamily = createProperty('fontFamily', {
    default: createVariant(`'Nunito', sans-serif`),
    secondary: createVariant(`'Roboto Mono', monospace`),
});

const useStyles = createUseStyles('demo', {
    specialText: {
        fontFamily: fontFamily.variants.secondary
    }
});
```

### Properties set

Properties sets are regular properties, only one difference is that they do not have a default value so
they can not be used in styles as normal properties, only their variants. They are useful for creating 
color palettes, because in this case you don't need a default value, you want to store colors in css 
variables without dynamic switching.

```tsx
export const palette = createPropertiesSet('palette', {
    primary: createVariant('red'),
    swcondary: createVariant('green'),
});

const useStyles = createUseStyles('demo', {
    specialText: {
        color: palette // this throws error because you can not access property without default value 
    },
    verySpecialText: {
        color: palette.variants.primary // and this is ok! 
    }
});

```

### Virtual properties

__!DEPRECATED!__ This functionality will be removed in next iterations

The difference between virtual property and regular property is that for the first ones CSS variables are not created.
Virtual properties lives only in memory.

```tsx
export const virtualProp = createVirtualProperty('test-virtual', {
    default: createVariant('variants in virtual property may contain any value'),
    myVal: createVariant({
        arr: []
    }),
});
```

### Properties setup

For property to work correctly it must be passed in context

```tsx
export const bg = createProperty('bg-color', {
    default: primaryColor.variants.default, // this notation do not create new variable it assign variant variable to this property variable
});

const glossiaContext = GlossiaContextManager.createContext({
    properties: [
        bg
    ],
});

ReactDOM.render(
    <React.StrictMode>
        <GlossiaContextProvider value={glossiaContext}>
            <App />
        </GlossiaContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
```

### Themes

Themes are compositions of variants, they are like masks for properties. When theme is activated it's variants are being
set as values to corresponding properties.

```tsx
const bg = createProperty('bg-color', {
    default: createVariant('white'),
    secondary: createVariant('green'),
});

const greenTheme = createTheme('green', [
    bg.variants.secondary
]);

const redTheme = createTheme('red', [
    createVariant('red', bg)
]);

const useStyles = createUseStyles('namespace', {
    test: {
        backgroundColor: bg,
    }
});

function App() {
    const {
        join,
        test,

    } = useStyles();

    return (
        <div>
            <div className={join(test)}>
                I'm basic, default white
            </div>
            <ThemeProvider theme={greenTheme}>
                <div className={join(test)}>
                    I'm green
                </div>
            </ThemeProvider>
            <ThemeProvider theme={redTheme}>
                <div className={join(test)}>
                    I'm red
                    <ThemeProvider theme={greenTheme}>
                        <div className={join(test)}>
                            And I get colors from closest theme, thats why I'm green!
                        </div>
                    </ThemeProvider>
                </div>
            </ThemeProvider>
        </div>
    );
}

const glossiaContext = GlossiaContextManager.createContext({
    properties: [
        bg
    ],
    themes: [
        greenTheme,
        redTheme
    ]
});

ReactDOM.render(
    <React.StrictMode>
        <GlossiaContextProvider value={glossiaContext}>
            <App />
        </GlossiaContextProvider>
    </React.StrictMode>,
    document.getElementById('root'),
);
```

Theme may be easily switched like this:

```tsx
function App() {
    const {
        join,
        test
    } = useStyles();
    const [theme, setTheme] = useState<ITheme>();

    return (
        <div>
            <button onClick={() => setTheme(greenTheme)}></button>
            <ThemeProvider theme={theme}>
                <div className={join(test)}>
                    My color is based on passed theme!
                </div>
            </ThemeProvider>
        </div>
    );
}
```

you may be wondering how themes work under the hood, it's very simple if you familiar with CSS variables. CSS variables
can be overwritten in scope eg. class, and themes in Glossia are just classes with bunch of overwritten variables. So
this code

```tsx
const bg = createProperty('bg-color', {
    default: createVariant('white'),
    secondary: createVariant('green'),
});

const greenTheme = createTheme('green', [
    bg.variants.secondary
]);

const redTheme = createTheme('red', [
    createVariant('red', bg)
]);

const useStyles = createUseStyles('namespace', {
    test: {
        backgroundColor: bg,
    }
});
```

produces CSS like:

```css
:root {
    --bg-color-default: white;
    --bg-color-secondary: green;
    --bg-color: var(--bg-color-default);
}

.theme-green {
    --bg-color: var(--bg-color-secondary);
}

.theme-red {
    --bg-color: 'red';
}

.test {
    background-color: var(--bg-color);
}
```

If element with class `.test` is located inside parent with class `.theme-red` than variable `--bg-color` for `.test`
element will be equal to `red`. It's a very simple mechanism yet powerful and often underestimated.

### useProperty

Glossia offers also dynamic value changes, you can change property value directly from component code (or watch for it's
changes)

```tsx
const bg = createProperty('bg-color', {
    default: createVariant('white'),
    secondary: createVariant('green'),
});

function App() {
    const [bgValue, setBgValue] = useProperty(bg);

    useEffect(() => {
        console.log('new property value: ', bgValue);
    }, [bgValue]);

    return (
        <button onClick={() => setBgValue('blue')}>
            set bgValue
        </button>
    );
}
```

WARNING: dynamic values don't work with scoped variables in themes, only with top level properties

## SSR mode

glossia also works in server side mode. SSR will be detected automatically or you can enforce it by passing mode option
set to `ssr` while creating context

```tsx
const glossiaContext = GlossiaContextManager.createContext({
    mode: 'ssr'
});
```

more complex example:

```tsx
import { GlossiaContextManager, GlossiaContextProvider, renderContextToHtmlString } from "glossia";

// in SSR mode it is important to set Glossia to development mode, otherwise caching will work and styles reloading will be blocked
if (process.env.NODE_ENV === 'development') {
    GlossiaContextManager.setDevelopmentMode();
}

app.get('/', async (req, res) => {
    const glossiaContext = GlossiaContextManager.createContext();

    const content = ReactDomServer.renderToString(
        <GlossiaContextProvider value={glossiaContext}>
            <App />
        </GlossiaContextProvider>
    );

    res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Glossia SSR Example</title>
        <style>
        ${renderContextToHtmlString(glossiaContext)}
        </style>
        <meta name='viewport' content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0' />
      </head>
      <body>
        <div id='root'>${content}</div>
      </body>
    </html>
    `);

    GlossiaContextManager.destroyContext(glossiaContext);
});
```

## Hydration mode

if you rendered styles on the server than it would be wastage rendering same styles on client side, fortunately Glossia
has solution! You can run Glossia in _hydration_ mode by running helper function
`getHydrationModeOptions()` which will extract all needed data from SSR rendered styles. In this case Glossia is almost
zero-runtime styling solution (expect React context)

Example:

```tsx
import { GlossiaContextManager, GlossiaContextProvider, getHydrationModeOptions } from "glossia";

const glossiaContext = GlossiaContextManager.createContext({
    ...getHydrationModeOptions(),
    properties: [
        primaryColors,
        bg,
        virtualProp
    ],
    themes: [
        lightTheme,
        darkTheme
    ]
});

ReactDOM.render(
    <React.StrictMode>
        <GlossiaContextProvider value={glossiaContext}>
            <App />
        </GlossiaContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

```

## FAQ

### Can I use it in production?

I don't recommend that. Glossia is still in early stage and needs some improvements

### How fast is it?

Probably not so much since it is still an early stage of development, nevertheless I would like glossia to rely on
native css as much as it is possible while providing minimal api for js, I hope it gets faster with time

## Alternatives?

Probably the best alternative I currently know is `vanilla-extract` I like the general idea behind this lib while I'm
not a big fan of it's api.
