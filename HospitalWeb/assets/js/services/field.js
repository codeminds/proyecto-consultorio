import { fieldTestData } from "../test-data.js";

export class FieldService {
    static list(callback) {
        const result = fieldTestData;
        callback(result);
    }
}