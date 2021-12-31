import { Counter } from './Counter';

let counter: Counter;

export interface ICounterFactoryOptions {
    ssr?: boolean
}

export function counterFactory(options: ICounterFactoryOptions = {}) {
    if (options.ssr) {
        return new Counter();
    }

    if (!counter) {
        counter = new Counter();
    }

    return counter;
}
