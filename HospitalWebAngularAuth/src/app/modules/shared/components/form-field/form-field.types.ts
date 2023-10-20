export enum InputType {
    Text = 'text',
    Password = 'password',
    Number = 'number',
    Email = 'email',
    Month = 'month',
    Week = 'week',
    Time = 'time',
    Search = 'search',
    Tel = 'tel',
    Url = 'url'
}

export enum DateType {
    Date = 'date',
    DateTime = 'datetime-local'
}

export interface Attributes {
    [name: string]: boolean | string | number;
}

export interface Option {
    label?: string,
    output?: string
    
}

export interface CompareOption extends Option {
    compare?: string,
    value?: string
}

export const Option = {
    default: {
        label: 'label',
        output: 'value'
    },
    basic: {
        label: null as string
    }
}

export const CompareOption = {
    default: {
        label: 'label',
        value: 'value',
        output: 'value'
    }
}