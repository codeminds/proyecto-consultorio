import { BaseService } from './base-service.js';

export class DoctorService extends BaseService{
    static get(id, callback){
        fetch(`https://localhost:5001/api/doctors/${id}`, {
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

    static list(filter, callback){ 
        filter = filter || {};

        const filterString = `identification=${filter.identification || ''}&firstName=${filter.firstName || ''}` 
                            + `&lastName=${filter.lastName || ''}&fieldId=${filter.fieldId || ''}`;

        fetch(`https://localhost:5001/api/doctors?${filterString}`, {
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

    static create(data, callback){
        fetch('https://localhost:5001/api/doctors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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

    static update(id, data, callback){
        fetch(`https://localhost:5001/api/doctors/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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

    static delete(id, callback){
        fetch(`https://localhost:5001/api/doctors/${id}`, {
            method: 'DELETE',
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