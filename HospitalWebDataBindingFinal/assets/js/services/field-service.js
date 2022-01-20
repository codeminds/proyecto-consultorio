import { fieldTestData } from '../test-data.js';

export class FieldService{
    static list(callback){ 
        fetch(`https://localhost:5001/api/fields`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.statusCode == 200){
                callback(response);
            }else{
                this.handleError(response);
            }
        });
    }
}