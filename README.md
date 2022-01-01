# Glossia

Glossia is a shortcut for latin "*Glossostigma elatinoides*"
which is a small underwater plant, as its role model plant Glossia is a small solution for styling React components and
theming web applications. I build it for blog because I wanted something more integrated with native CSS. All Glossia
theming system is based on pure CSS properties and classes which is real superpower. Apart from the above Glossia has no
explicit dependencies expect React and Typescript what makes it small and safe for use.

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

const useStyles = createUseStyles({
    testDynamic: ({ val }: { val: number }) => ({
        background: props.val % 2 ? 'red' : 'green',
    }),
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
        span: () => ({
            background: 'blue',
        }),
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
    const classes = useStyles({
        val
    });
    const [arr, setArr] = useState<number[]>([0, 1, 2, 3, 4]);

    return (
        <div>
            <div className={classes.testDynamic}>
                Lorem ipsum dolor sit amet.
                <button onClick={() => setVal(x => x + 1)}>change color</button>
            </div>
            {arr.map(num => (<div key={num} className={classes.squareDiv}>
                Number: {num}
            </div>))}
            <p className={classes.myParagraph}>
                Lorem ipsum dolor sit amet.
                <span>Lorem ipsum dolor sit.</span>
                <span className="special-text">Lorem ipsum dolor sit amet.</span>
            </p>
            <h1 className={classes.testAnimation}>
                Lorem ipsum dolor sit amet.
            </h1>
        </div>
    );
}
```

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

there is additional variant type called MediaVariant used in themes, it creates value which will be assigned to property
if passed media query is fulfilled. Example:

```tsx
const bg = createProperty('bg-color', {
    default: createVariant('white'),
});

const breakpoint = createVariant('all and (max-width: 1000px)');

const darkTheme = createTheme('dark', [
    createVariant('#000', bg), // if dark theme is active than property bg will be set to #000
    createMediaVariant('green', sm, bg), // if dark theme is active and media from breakpoint are met than bg will be set to green
]);
```

worth of note is also fact that you can create variant for any property dynamically like this:

```tsx
createVariant('#000', bg)
```

but above notation will not create new variable, it will overwrite value for property only in theme scope.

### Properties

Property is variable to which you can assign value (variant) then you can use property in styles and it will track
changes. When property value changes styles follows without rerenders because property is just a CSS variable

Property may be used directly in styles like this:

```tsx
const bg = createProperty('bg-color', {
    default: createVariant('white'),
    secondary: createVariant('green'),
});

const useStyles = createUseStyles({
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

### Virtual properties

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

const useStyles = createUseStyles({
    test: {
        backgroundColor: bg,
    }
});

function App() {
    const classes = useStyles();

    return (
        <div>
            <div className={classes.test}>
                I'm basic, default white
            </div>
            <ThemeProvider theme={greenTheme}>
                <div className={classes.test}>
                    I'm green
                </div>
            </ThemeProvider>
            <ThemeProvider theme={redTheme}>
                <div className={classes.test}>
                    I'm red
                    <ThemeProvider theme={greenTheme}>
                        <div className={classes.test}>
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
    const classes = useStyles();
    const [theme, setTheme] = useState<ITheme>();

    return (
        <div>
            <button onClick={() => setTheme(greenTheme)}></button>
            <ThemeProvider theme={theme}>
                <div className={classes.test}>
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

const useStyles = createUseStyles({
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

## SSR

glossia works also in server side mode. SSR will be detected automatically or you can enforce it by passing `ssr` option
while creating context

```tsx
const glossiaContext = GlossiaContextManager.createContext({
    ssr: true
});
```

more complex example:

```tsx
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
        ${glossiaContext.toString()}
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

## Known issues

I know I messed up some types, for example `createUseStyles` has a bug and props are extracted not exactly like they
should be. Correct solution involves nested iterations in TS but yet I had not enough time to solve problem.

## FAQ

### Can I use it in production?

I don't recommend that. Glossia is still in early stage and needs some improvements

### How fast is it?

Probably not so much since it is still an early stage of development, nevertheless I would like glossia to rely on
native css as much as it is possible while providing minimal api for js, I hope it gets faster with time

