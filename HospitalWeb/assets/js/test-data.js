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

export function createGuid() {  
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {  
       var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);  
       return v.toString(16);  
    });  
}  