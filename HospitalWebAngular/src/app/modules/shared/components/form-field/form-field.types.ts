export enum InputType {
    Text = 'text',
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

export enum ButtonType {
    None = '',
    Netural = 'neutral',
    Success = 'success',
    Danger = 'danger'
}

export interface Attributes {
    [name: string]: boolean | string | number;
}

export interface Option {
    label?: string,
    value?: string
}

export const Option = {
    default: {
        label: 'label',
        value: 'value'
    },
    basic: {
        label: null as string,
        value: null as string,
    }
}