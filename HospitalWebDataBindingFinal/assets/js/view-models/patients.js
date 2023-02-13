import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { GenderService } from '../services/gender.js';
import { PatientsService } from '../services/patient.js';
import { DateService } from '../services/date.js';
import { OneWayCollectionProp, OneWayProp, TwoWayProp } from '../data-bind.js';

class ViewModel extends BaseViewModel {
   #id;
   #patient;
   #filter;
   #genders;
   #formTitle;
   #modal;
   #results;
   #formErrors;

   constructor() {
      super();

      this.#id = null;
   }

   initGenders() {
      return new Promise((resolve) => {
         this.#genders = {
            filter: new OneWayCollectionProp([]),
            form: new OneWayCollectionProp([])
         };
   
         this.#genders.filter.subscribe(document.querySelector('[data-filter="genders"]'));
         this.#genders.form.subscribe(document.querySelector('[data-form="genders"]'));
   
         GenderService.list((result) => {
            this.#genders.filter.value = [{ id: '', name: 'Todos' }, ...result.data];
            this.#genders.form.value = result.data;
            resolve();
         });
      });
   }

   initFilter() {
      this.#filter = {
         documentId: new TwoWayProp(null, 'string'),
         firstName: new TwoWayProp(null, 'string'),
         lastName: new TwoWayProp(null, 'string'),
         birthDateFrom: new TwoWayProp(null, 'date', {
            toInputString: DateService.toInputDateString
         }),
         birthDateTo: new TwoWayProp(null, 'date', {
            toInputString: DateService.toInputDateString
         }),
         genderId: new TwoWayProp(null, 'number')
      };

      this.#filter.documentId.subscribe(document.forms.filter.documentId);
      this.#filter.firstName.subscribe(document.forms.filter.firstName);
      this.#filter.lastName.subscribe(document.forms.filter.lastName);
      this.#filter.birthDateFrom.subscribe(document.forms.filter.birthDateFrom);
      this.#filter.birthDateTo.subscribe(document.forms.filter.birthDateTo);
      this.#filter.genderId.subscribe(document.forms.filter.gender);

      document.querySelector('[data-search]').addEventListener('click', () => {
         this.searchPatients();
      });
   }

   initPatient() {
      this.#patient = {
         documentId: new TwoWayProp(null, 'string'),
         firstName: new TwoWayProp(null, 'string'),
         lastName: new TwoWayProp(null, 'string'),
         birthDate: new TwoWayProp(null, 'date', {
            toInputString: DateService.toInputDateString
         }),
         genderId: new TwoWayProp(this.#genders.form.value[0]?.id, 'number')
      };

      this.#patient.documentId.subscribe(document.forms.createUpdate.documentId);
      this.#patient.firstName.subscribe(document.forms.createUpdate.firstName);
      this.#patient.lastName.subscribe(document.forms.createUpdate.lastName);
      this.#patient.birthDate.subscribe(document.forms.createUpdate.birthDate);
      this.#patient.genderId.subscribe(document.forms.createUpdate.gender);
   }

   initModal() {
      this.#formTitle = new OneWayProp(null, 'string');
      this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

      this.#formErrors = new OneWayCollectionProp([]);
      this.#formErrors.subscribe(document.querySelector('[data-form-errors]'));

      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         this.#patient.documentId.value = null;
         this.#patient.firstName.value = null;
         this.#patient.lastName.value = null;
         this.#patient.birthDate.value = null;
         this.#patient.genderId.value = this.#genders.form.value[0].id;
         this.#formTitle.value = null;
         this.#formErrors.value = [];
      });

      document.querySelector('[data-new]').addEventListener('click', () => {
         this.#formTitle.value = 'Nuevo Paciente';
         this.#modal.open();
      });

      document.querySelector('[data-save]').addEventListener('click', () => {
         this.#save();
      });

      document.querySelector('[data-cancel]').addEventListener('click', () => {
         this.#modal.close();
      });
   }

   initResults() {
      const results = document.querySelector('[data-results]');
      results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               PatientsService.get(id, (result) => {
                  const patient = result.data;
                  this.#id = patient.id;
                  this.#patient.documentId.value = patient.documentId;
                  this.#patient.firstName.value = patient.firstName;
                  this.#patient.lastName.value = patient.lastName;
                  this.#patient.birthDate.value = patient.birthDate;
                  this.#patient.genderId.value = patient.gender.id;
                  this.#formTitle.value = 'Editar Paciente';
                  this.#modal.open();
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  PatientsService.delete(id, (result) => {
                     if (result.success) {
                        this.searchPatients();
                     } else {
                        let errors = '';

                        for(const error of result.messages) {
                           errors += `${error}\n`;
                        }

                        if(errors != '') {
                           alert(errors);
                        }
                     }
                  });
               }
               break;
         }
      });

      this.#results = new OneWayCollectionProp([], {
         toDisplayDate: (value) => {
            return DateService.toDisplayLocaleString(new Date(value), 'es-US')
         }
      });
      this.#results.subscribe(results);
   }

   #save() {
      const data = {
         documentId: this.#patient.documentId.value,
         firstName: this.#patient.firstName.value,
         lastName: this.#patient.lastName.value,
         birthDate: DateService.toInputDateString(this.#patient.birthDate.value) || null,
         genderId: this.#patient.genderId.value
      };

      const afterSave = (result) => {
         if(result.success) {
            const patient = result.data;
            this.#modal.close();
            this.#filter.documentId.value = patient.documentId;
            this.#filter.firstName.value = null;
            this.#filter.lastName.value = null;
            this.#filter.birthDateFrom.value = null;
            this.#filter.birthDateTo.value = null;
            this.#filter.genderId.value = null;
            this.#searchPatients();
         } else {
            this.#formErrors.value = result.messages;
         }
      };

      this.#formErrors.value = [];
      if (this.#id == null) {
         PatientsService.insert(data, afterSave);
      } else {
         PatientsService.update(this.#id, data, afterSave);
      }
   }

   searchPatients() {
      const filter = {
         documentId: this.#filter.documentId.value,
         firstName: this.#filter.firstName.value,
         lastName: this.#filter.lastName.value,
         birthDateFrom: this.#filter.birthDateFrom.value,
         birthDateTo: this.#filter.birthDateTo.value,
         genderId: this.#filter.genderId.value
      };

      PatientsService.list(filter, (result) => {
         this.#results.value = result.data;
      });
   }
}

const viewModel = new ViewModel();

/* Para inicializar ciertos valores se necesitan cargar la lista de datos de géneros */
Promise.all([
   this.initGenders()
]).then(() => {
   this.initFilter();
   this.initPatient();
   this.initModal();
   this.initResults();

   this.searchPatients();
});