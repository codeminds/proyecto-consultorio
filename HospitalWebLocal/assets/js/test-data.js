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

export const genderTestData = [
   {
      id: 1,
      name: 'Femenino'
   },
   {
      id: 2,
      name: 'Masculino'
   }
];

export const doctorTestData = [
   {
      id: 1,
      documentId: '123232123',
      firstName: 'Hugo',
      lastName: 'Doctor 1',
      field: {
         id: 1,
         name: 'Doctor General'
      }
   },
   {
      id: 2,
      documentId: '123245123',
      firstName: 'Paco',
      lastName: 'Doctor 2',
      field: {
         id: 4,
         name: 'Cirujano'
      }
   },
   {
      id: 3,
      documentId: '323232563',
      firstName: 'Luis',
      lastName: 'Doctor 3',
      field: {
         id: 2,
         name: 'Dentista'
      }
   }
];

export const patientTestData = [
   {
      id: 1,
      documentId: '123456789',
      firstName: 'Hugo',
      lastName: 'Patient 1',
      birthDate: new Date('1992-01-30T11:00:00'),
      gender: {
         id: 2,
         name: 'Masculino'
      }
   },
   {
      id: 2,
      documentId: '234567890',
      firstName: 'Paco',
      lastName: 'Patient 2',
      birthDate: new Date('1987-05-11T03:00:00'),
      gender: {
         id: 2,
         name: 'Masculino'
      }
   },
   {
      id: 3,
      documentId: '345678901',
      firstName: 'Luis',
      lastName: 'Patient 3',
      birthDate: new Date('1992-01-25T22:00:00'),
      gender: {
         id: 2,
         name: 'Masculino'
      }
   },
   {
      id: 4,
      documentId: '145678901',
      firstName: 'Daniela',
      lastName: 'Patient 4',
      birthDate: new Date('1970-04-04T03:00:00'),
      gender: {
         id: 1,
         name: 'Femenino'
      }
   }
];

export const appointmentTestData = [
   {
      id: 1,
      date: new Date('2021-11-08T15:30:00'),
      doctor: {
         id: 1,
         documentId: '123232123',
         firstName: 'Hugo',
         lastName: 'Doctor 1',
         field: {
            id: 1,
            name: 'Doctor General'
         }
      },
      patient: {
         id: 1,
         documentId: '123456789',
         firstName: 'Hugo',
         lastName: 'Patient 1',
         birthDate: new Date('1992-01-30T11:00:00'),
         gender: {
            id: 2,
            name: 'Masculino'
         }
      }
   },
   {
      id: 2,
      date: new Date('2021-11-08T13:00:00'),
      doctor: {
         id: 3,
         documentId: '323232563',
         firstName: 'Luis',
         lastName: 'Doctor 3',
         field: {
            id: 3,
            name: 'Dentista'
         }
      },
      patient: {
         id: 3,
         documentId: '345678901',
         firstName: 'Luis',
         lastName: 'Patient 3',
         birthDate: new Date('1992-01-25T22:00:00'),
         gender: {
            id: 2,
            name: 'Masculino'
         }
      }
   },
   {
      id: 3,
      date: new Date('2021-10-12T09:00:00'),
      doctor: {
         id: 1,
         documentId: '12332123',
         firstName: 'Hugo',
         lastName: 'Doctor 1',
         field: {
            id: 1,
            name: 'Doctor General'
         }
      },
      patient: {
         id: 4,
         documentId: '145678901',
         firstName: 'Daniela',
         lastName: 'Patient 4',
         birthDate: new Date('1970-04-04T03:00:00'),
         gender: {
            id: 1,
            name: 'Femenino'
         }
      }
   },
];

export function getNextId(collection) {
   let id = collection.length;

   while (collection.some((item) => item.id == id)) {
      id++;
   }

   return id;
}
