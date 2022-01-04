export type IClasses<S> = {
    [Key in keyof S]: IClassName
} & {
    join(...classes: Array<string|IClassName>): string
}

export interface IClassName {
    (renderClass: boolean): string
    toString(): string
}
