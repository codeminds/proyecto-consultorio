import { createGuid, patientTestData } from '../test-data.js';

export class PatientService{
    static get(id){
        let result = patientTestData.find((item) => {
            return item.id == id;
        });

        return result;
    }

    static list(filter){ 
        filter = filter || {};
        let results = patientTestData.filter((item) => { 
            let add = true;

            if(filter.documentId != null && filter.documentId.trim() != ''){
                add = item.documentId.includes(filter.documentId) && add;
            }
  
            if(filter.firstName != null && filter.firstName.trim() != ''){
                add = item.firstName.includes(filter.firstName) && add;
            } 

            if(filter.lastName != null && filter.lastName.trim() != ''){
                add = item.lastName.includes(filter.lastName) && add;
            }

            if(filter.dateFrom != null){
                add = item.birthDate >= filter.dateFrom && add;
            }

            if(filter.dateTo != null){
                add = item.birthDate <= filter.dateTo && add;
            }

            return add;
        });

        return results;
    }

    static create(data){
        data.id = createGuid();
        patientTestData.push(data);
    }

    static update(data){
        let patient = PatientService.get(data.id);

        if(patient == null){
            return null;
        }

        patient.documentId = data.documentId;
        patient.firstName = data.firstName;
        patient.lastName = data.lastName;
        patient.birthDate = data.birthDate;
    }

    static delete(id){
        let index = patientTestData.findIndex((item) => {
            return item.id == id;
        });

        patientTestData.splice(index, 1);
    }
}