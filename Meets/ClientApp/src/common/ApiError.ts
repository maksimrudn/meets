import IApiError from "./IApiError";


export default class ApiError extends Error implements IApiError  {
    constructor(message?: string, code?: number, title?: string,) {
        super(message);

        this.code = code;
        this.title = title;        
    }

    code?: number
    title?: string
}