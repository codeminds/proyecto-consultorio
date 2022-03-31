export class FieldService {
    static list(callback) {
        fetch(`https://localhost:7221/api/fields`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.json())
        .then((data) => {
            if(data.statusCode == 200) {
                callback(data);
            } else {
                this.handleError(data);
            }
        });
    }
}