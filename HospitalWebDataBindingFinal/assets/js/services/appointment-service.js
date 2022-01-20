import { createGuid, appointmentTestData } from '../test-data.js';
import { DoctorService } from './doctor-service.js';
import { PatientService } from './patient-service.js';

export class AppointmentService{
    static get(id){
        let result = appointmentTestData.find((item) => {
            return item.id == id;
        });

        return result;
    }

    static list(filter){
        filter = filter || {};

        let doctors = DoctorService.list(filter.doctor);
        let patients = PatientService.list(filter.patient);
        let results = appointmentTestData.filter((item) => {
            let add = true;

            if(filter.dateFrom != null){
                add = item.date >= filter.dateFrom && add;
            }

            if(filter.dateTo != null){
                add = item.date <= filter.dateTo && add;
            } 

            add = doctors.length > 0 && doctors.some((doctor) => doctor.id == item.doctorId) && add;
            add = patients.length > 0 && patients.some((patient) => patient.id == item.patientId) && add; 
        
            return add;
        });

        let formattedResults = [];
        for(let i = 0; i < results.length; i++){
            let patient = PatientService.get(results[i].patientId);
            let doctor = DoctorService.get(results[i].doctorId);

            let result = {
                id: results[i].id,
                date: results[i].date,
                patientId: results[i].patiendId,
                doctorId: results[i].doctorId,
                patientName: patient.firstName + ' ' + patient.lastName,
                doctorName: doctor.firstName + ' ' + doctor.lastName,
                doctorField: doctor.field
            };

            formattedResults.push(result);
        }

        return formattedResults;
    }

    static create(data){
        data.id = createGuid();
        appointmentTestData.push(data);
    }

    static update(data){
        let appoinment = AppointmentService.get(data.id);

        if(appoinment == null){
            return null;
        }

        appoinment.date = data.date;
        appoinment.patientId = data.patientId;
        appoinment.doctorId = data.doctorId;
    }

    static delete(id){
        let index = appointmentTestData.findIndex((item) => {
            return item.id == id;
        });

        appointmentTestData.splice(index, 1);
    }
}