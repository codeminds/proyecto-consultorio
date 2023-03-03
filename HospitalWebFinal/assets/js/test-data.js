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
      fieldId: 1,
      field: 'Doctor General'
   },
   {
      id: 2,
      documentId: '123245123',
      firstName: 'Paco',
      lastName: 'Doctor 2',
      fieldId: 4,
      field: 'Cirujano'
   },
   {
      id: 3,
      documentId: '323232563',
      firstName: 'Luis',
      lastName: 'Doctor 3',
      fieldId: 2,
      field: 'Dentista'
   }
];

export const patientTestData = [
   {
      id: 1,
      documentId: '123456789',
      firstName: 'Hugo',
      lastName: 'Patient 1',
      genderId: 2,
      gender: 'Masculino',
      birthDate: new Date('1992-01-30T11:00:00')
   },
   {
      id: 2,
      documentId: '234567890',
      firstName: 'Paco',
      lastName: 'Patient 2',
      genderId: 2,
      gender: 'Masculino',
      birthDate: new Date('1987-05-11T03:00:00')
   },
   {
      id: 3,
      documentId: '345678901',
      firstName: 'Luis',
      lastName: 'Patient 3',
      genderId: 2,
      gender: 'Masculino',
      birthDate: new Date('1992-01-25T22:00:00')
   },
   {
      id: 4,
      documentId: '145678901',
      firstName: 'Daniela',
      lastName: 'Patient 4',
      genderId: 1,
      gender: 'Femenino',
      birthDate: new Date('1970-04-04T03:00:00')
   }
];

export const appointmentTestData = [
   {
      id: 1,
      date: new Date('2021-11-08T15:30:00'),
      patientId: 1, //Paciente Hugo
      patientName: 'Hugo Patient 1',
      doctorId: 1, //Doctor Hugo
      doctorName: 'Hugo Doctor 1',
      doctorField: 'Doctor General'
   },
   {
      id: 2,
      date: new Date('2021-11-08T13:00:00'),
      patientId: 2, //Paciente Paco
      patientName: 'Paco Patient 2',
      doctorId: 2, //Doctor Paco
      doctorName: 'Paco Doctor 2',
      doctorField: 'Cirujano'
   },
   {
      id: 3,
      date: new Date('2021-09-25T14:30:00'),
      patientId: 3, //Paciente Luis
      patientName: 'Luis Patient 3',
      doctorId: 3, //Doctor Luis
      doctorName: 'Luis Doctor 3',
      doctorField: 'Dentista'
   },
   {
      id: 4,
      date: new Date('2021-10-12T09:00:00'),
      patientId: 4, //Paciente Daniela
      patientName: 'Daniela Patient 4',
      doctorId: 1, //Doctor Hugo
      doctorName: 'Hugo Doctor 1',
      doctorField: 'Doctor General'
   }
];

export function getNextId(collection) {
   let id = collection.length;

   while (collection.some((item) => item.id == id)) {
      id++;
   }

   return id;
}
