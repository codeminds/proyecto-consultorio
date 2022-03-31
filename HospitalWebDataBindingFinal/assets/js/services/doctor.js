import { BaseService } from "./base-service.js";

export class DoctorService extends BaseService{
    static get(id, callback) {
        fetch(`https://localhost:7221/api/doctors/${id}`, {
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
    
    static list(filter, callback) {
        filter = filter || {};

        const filterString = `documentId=${filter.documentId || ''}&firstName=${filter.firstName || ''}`
                            + `&lastName=${filter.lastName || ''}&fieldId=${filter.fieldId || ''}`

        fetch(`https://localhost:7221/api/doctors?${filterString}`, {
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

    //Función de búsqueda que no distingue valores fijos para cada campo de filtro, si no en vez
    //utiliza una lista de strings para comparar valores con todos los que desea buscar
    static search(filters, callback) {
        let filterString = '';

        for(let i = 0; i < filters.length; i++) {
            filterString += `s=${filters[i]}&`;            
        }

        fetch(`https://localhost:7221/api/doctors/search?${filterString}`, {
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

    static create(data, callback) {
        fetch(`https://localhost:7221/api/doctors`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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

    static update(id, data, callback) {
        fetch(`https://localhost:7221/api/doctors/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
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

    static delete(id, callback) { 
        fetch(`https://localhost:7221/api/doctors/${id}`, {
            method: 'DELETE',
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
