export enum InputType {
    Text = 'text',
    Number = 'number',
    Email = 'email',
    Date = 'date',
    Month = 'month',
    Week = 'week',
    Time = 'time',
    DateTime = 'datetime-local',
    Search = 'search',
    Tel = 'tel',
    Url = 'url'
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
    label: string,
    value: boolean | string | number;
}