export let appointmentTestData = [
    {   
        id: '3b6a5623-4bbb-464a-9076-d5d702bdc9c9',
        date: new Date('2021-11-08T15:30:00'),
        patientId:'742e0384-7f85-429e-bc32-edfa8734f376', //Paciente Hugo
        doctorId:'c1416bb4-0165-41f1-afb1-2c0455cf3360', //Doctor Hugo
    },
    {   
        id: '4e5e466e-0ab4-4490-9c3e-209690ed1e2d',
        date: new Date('2021-11-08T13:00:00'),
        patientId:'6e05132e-3c45-46c9-98d1-c0f426b0bbd3', //Paciente Paco
        doctorId:'2d9016cd-dc00-4b6e-99e5-84fc368c9035', //Doctor Paco
    },
    {   
        id: '2ed98d71-7f2b-4a9a-b1d6-e65bc0bc71cc',
        date: new Date('2021-09-25T14:30:00'),
        patientId:'c64e1979-76cb-447f-8277-3f3793c171a6', //Paciente Luis
        doctorId:'49377abf-cef6-446e-9e18-f506ff1be462', //Doctor Luis
    },
    {   
        id: '6d3d2a7d-e6a5-4445-881d-203a09b34fd3',
        date: new Date('2021-10-12T09:00:00'),
        patientId:'e7dc3537-b274-418a-aed5-41b5fcd00f78', //Paciente Daniela
        doctorId:'c1416bb4-0165-41f1-afb1-2c0455cf3360', //Doctor Hugo
    },
];

export const doctorTestData = [
    {
        id: 'c1416bb4-0165-41f1-afb1-2c0455cf3360',
        documentId: '123232123',
        firstName: 'Hugo',
        lastName: 'Doctor 1',
        fieldId: 1,
        field: 'Doctor General'
    },
    {
        id: '2d9016cd-dc00-4b6e-99e5-84fc368c9035',
        documentId: '123245123',
        firstName: 'Paco',
        lastName: 'Doctor 2',
        fieldId: 4,
        field: 'Cirujano'
    },
    {
        id: '49377abf-cef6-446e-9e18-f506ff1be462',
        documentId: '323232563',
        firstName: 'Luis',
        lastName: 'Doctor 3',
        fieldId: 2,
        field: 'Dentista'
    }
];

export const fieldTestData = [
    {
        id: 1,
        name: 'Doctor General'
    },
    {
        id: 2,
        name: 'Dentista'
    },
    {
        id: 3,
        name: 'Pediatra'
    },
    {
        id: 4,
        name: 'Cirujano'
    }
];

export let patientTestData = [
    {
        id: '742e0384-7f85-429e-bc32-edfa8734f376',
        documentId: '123456789',
        firstName: 'Hugo',
        lastName: 'Patient 1',
        gender: true,
        birthDate: new Date('1992-01-30T11:00:00')
    },
    {
        id: '6e05132e-3c45-46c9-98d1-c0f426b0bbd3',
        documentId: '234567890',
        firstName: 'Paco',
        lastName: 'Patient 2',
        gender: true,
        birthDate: new Date('1987-05-11T03:00:00')
    },
    { 
        id: 'c64e1979-76cb-447f-8277-3f3793c171a6',
        documentId: '345678901',
        firstName: 'Luis',
        lastName: 'Patient 3',
        gender: true,
        birthDate: new Date('1992-01-25T22:00:00')
    },
    { 
        id: 'e7dc3537-b274-418a-aed5-41b5fcd00f78',
        documentId: '145678901',
        firstName: 'Daniela',
        lastName: 'Patient 4',
        gender: false,
        birthDate: new Date('1970-04-04T03:00:00')
    }
];

export function createGuid() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
       var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
       return v.toString(16);  
    });  
}  