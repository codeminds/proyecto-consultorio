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

export const statusTestData = [
   {
      id: 1,
      name: 'Activa'
   },
   {
      id: 2,
      name: 'Cancelada'
   }
];

export const doctorTestData = [
   {
      id: 1,
      code: '1232321231',
      firstName: 'Hugo',
      lastName: 'Doctor 1',
      field: {
         id: 1,
         name: 'Doctor General'
      }
   },
   {
      id: 2,
      code: '1232451232',
      firstName: 'Paco',
      lastName: 'Doctor 2',
      field: {
         id: 4,
         name: 'Cirujano'
      }
   },
   {
      id: 3,
      code: '3232325632',
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
      tel: '23439475',
      email: 'hugo@mail.com'
   },
   {
      id: 2,
      documentId: '234567890',
      firstName: 'Paco',
      lastName: 'Patient 2',
      tel: '8574657',
      email: 'paco@mail.com'
   },
   {
      id: 3,
      documentId: '3456789012',
      firstName: 'Luis',
      lastName: 'Patient 3',
      tel: '47563758',
      email: 'luis@mail.com'
   },
   {
      id: 4,
      documentId: '145678901',
      firstName: 'Daniela',
      lastName: 'Patient 4',
      tel: '87586970',
      email: 'daniela@mail.com'
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
         tel: '23439475',
         email: 'hugo@mail.com'
      },
      status: {
         id: 1,
         name: 'Activa'
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
         documentId: '3456789012',
         firstName: 'Luis',
         lastName: 'Patient 3',
         tel: '47563758',
         email: 'luis@mail.com'
      },
      status: {
         id: 1,
         name: 'Activa'
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
         tel: '87586970',
         email: 'daniela@mail.com'
      },
      status: {
         id: 2,
         name: 'Cancelada'
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
