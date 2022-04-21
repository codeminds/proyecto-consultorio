export enum MessageType {
    Info,
    Success,
    Warning,
    Error
}

export enum HttpMethod {
    GET,
    PUT,
    POST, 
    DELETE
}

export interface APIResponse {
    httpStatusCode: number,
    success: boolean,
    messages: string[],
    data: any
}

export interface QueryParams {
    [name: string]: string | number | boolean | Date | string[] | number[] | boolean[] | Date[];
}

export interface Message {
    type: MessageType,
    text: string
}