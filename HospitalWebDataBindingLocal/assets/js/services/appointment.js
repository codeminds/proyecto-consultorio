import { appointmentTestData, createGuid } from "../test-data.js";
import { DoctorService } from "./doctor.js";
import { PatientService } from "./patient.js";

export class AppointmentService {
    static get(id, callback) {
        const result = appointmentTestData.find((item) => {
            return item.id == id;
        })

        callback(result);
    }

    static list(filter, callback) {
        const result = []; 

        let doctors;
        let patients;

        DoctorService.list(filter.doctor, (result) => {
            doctors = result;
        });

        PatientService.list(filter.patient, (result) => {
            patients = result;
        });
        
        for(const appointment of appointmentTestData) {
            let add = true;
            
            add = add && (!filter.dateFrom || appointment.date >= filter.dateFrom);
            add = add && (!filter.dateTo || appointment.date <= filter.dateTo);
            add = add && doctors.length > 0 && doctors.some((doctor) => doctor.id == appointment.doctorId);
            add = add && patients.length > 0 && patients.some((patient) => patient.id == appointment.patientId);
          
            if(add) {
                result.push(appointment);
            }
        }

        callback(result);
    }

    static create(data, callback) {
        data.id = createGuid();
        appointmentTestData.push(data);
        callback(data);
    }

    static update(id, data, callback) {
        AppointmentService.get(id, (appointment) => {
            if(appointment != null) {
                appointment.date = data.date;
                appointment.patientId = data.patientId;
                appointment.doctorId = data.doctorId;

                callback(appointment);

            } else {
                callback(null);              
            }
        });
    }

    static delete(id, callback) { 
        const index = appointmentTestData.findIndex((item) => {
            return item.id == id;
        });

        if(index >= 0) {
            appointmentTestData.splice(index, 1);
            callback(true);
        } else {
            callback(false);
        }
    }
}