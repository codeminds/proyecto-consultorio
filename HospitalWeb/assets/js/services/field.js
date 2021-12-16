import { fieldTestData } from "../test-data.js";

export class FieldService {
    static get(id, callback) {
        const result = fieldTestData.find((item) => {
            return item.id == id;
        })

        callback(result);
    }

    static list(callback) {
        const result = fieldTestData;
        callback(result);
    }
}