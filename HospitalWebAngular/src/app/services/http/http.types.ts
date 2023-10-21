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

export interface APIResponse<T> {
    httpStatusCode: number;
    success: boolean;
    messages: string[];
    data: T;
}

export interface QueryParams {
    [name: string]: any;
}

export interface HttpOptions {
    params?: QueryParams;
 }

export interface Message {
    type: MessageType;
    text: string;
}