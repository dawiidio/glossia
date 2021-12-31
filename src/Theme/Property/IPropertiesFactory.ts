import { CSSProperties } from 'react';

export type IPropertiesFactory<T> = ((props: T | undefined) => CSSProperties);

