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
    PATCH, 
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

export interface Message {
    type: MessageType;
    text: string;
}

export interface HttpOptions {
    accessToken?: boolean;
    refreshToken?: boolean;
    params?: QueryParams;
}