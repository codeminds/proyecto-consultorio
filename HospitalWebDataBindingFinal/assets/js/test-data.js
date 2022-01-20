export let patientTestData = [
    {
        id: '742e0384-7f85-429e-bc32-edfa8734f376',
        documentId: '123456789',
        firstName: 'Hugo',
        lastName: 'Patient 1',
        birthDate: new Date('1992-01-30T11:00:00')
    },
    {
        id: '6e05132e-3c45-46c9-98d1-c0f426b0bbd3',
        documentId: '234567890',
        firstName: 'Paco',
        lastName: 'Patient 2',
        birthDate: new Date('1987-05-11T03:00:00')
    },
    { 
        id: 'c64e1979-76cb-447f-8277-3f3793c171a6',
        documentId: '345678901',
        firstName: 'Luis',
        lastName: 'Patient 3',
        birthDate: new Date('1992-01-25T22:00:00')
    },
    { 
        id: 'e7dc3537-b274-418a-aed5-41b5fcd00f78',
        documentId: '145678901',
        firstName: 'Rico',
        lastName: 'Patient 4',
        birthDate: new Date('1970-04-04T03:00:00')
    }
    
];

export let doctorTestData = [
    {
        id: 'c1416bb4-0165-41f1-afb1-2c0455cf3360',
        documentId: '123232123',
        firstName: 'Hugo',
        lastName: 'Doctor 1',
        fieldId: 1,
        field: 'General Doctor'
    },
    {
        id: '2d9016cd-dc00-4b6e-99e5-84fc368c9035',
        documentId: '123245123',
        firstName: 'Paco',
        lastName: 'Doctor 2',
        fieldId: 4,
        field: 'Surgery'
    },
    {
        id: '49377abf-cef6-446e-9e18-f506ff1be462',
        documentId: '323232563',
        firstName: 'Luis',
        lastName: 'Doctor 3',
        fieldId: 2,
        field: 'Dentist'
    },
];

export let appointmentTestData = [
    {   
        id: '83788cdb-0756-4be8-8d37-ecc913c96a3d',
        date: new Date(new Date() + 1),
        patientId: '742e0384-7f85-429e-bc32-edfa8734f376',
        doctorId: 'c1416bb4-0165-41f1-afb1-2c0455cf3360'
    },
    {
        id: '3be77ba3-a52c-4584-87af-0c138df71b0c',
        date: new Date(new Date() + 3),
        patientId: '6e05132e-3c45-46c9-98d1-c0f426b0bbd3',
        doctorId: '2d9016cd-dc00-4b6e-99e5-84fc368c9035'
    }
];

export let fieldTestData = [
    {
        id: 1,
        name: 'General Doctor'
    },
    {
        id: 2,
        name: 'Dentist'
    },
    {
        id: 3,
        name: 'Pediatrics'
    },
    {
        id: 3,
        name: 'Surgery'
    }
]

export function createGuid() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
       var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
       return v.toString(16);  
    });  
}  

