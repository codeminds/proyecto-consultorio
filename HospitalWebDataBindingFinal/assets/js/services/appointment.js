import { DateService } from './date.js';


export class AppointmentService {
    static get(id, callback) {
        fetch(`https://localhost:7221/api/appointments/${id}`, {
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

        const filterString = `doctorDocumentId=${filter.doctor.documentId || ''}&doctorFirstName=${filter.doctor.firstName || ''}`
                            + `&doctorLastName=${filter.doctor.lastName || ''}&doctorFieldId=${filter.doctor.fieldId || ''}`
                            + `&patientDocumentId=${filter.patient.documentId || ''}&patientFirstName=${filter.patient.firstName || ''}`
                            + `&patientLastName=${filter.patient.lastName || ''}&patientGender=${filter.patient.gender != null ? filter.patient.gender : ''}`
                            + `&patientBirthDateFrom=${DateService.toInputDateString(filter.patient.birthDateFrom) || ''}&birthDateTo=${DateService.toInputDateString(filter.patient.birthDateTo) || ''}`
                            + `&dateFrom=${DateService.toInputDateString(filter.dateFrom) || ''}&dateTo=${DateService.toInputDateString(filter.dateTo) || ''}`

        fetch(`https://localhost:7221/api/appointments?${filterString}`, {
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
        fetch(`https://localhost:7221/api/appointments/`, {
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
        fetch(`https://localhost:7221/api/appointments/${id}`, {
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
        fetch(`https://localhost:7221/api/appointments/${id}`, {
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