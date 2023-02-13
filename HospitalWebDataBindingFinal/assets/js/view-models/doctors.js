import { BaseViewModel } from './base.js';
import { Modal } from '../controls/modal.js';
import { FieldService } from '../services/field.js';
import { DoctorService } from '../services/doctor.js';
import { OneWayCollectionProp, OneWayProp, TwoWayProp } from '../data-bind.js';

class ViewModel extends BaseViewModel {
   #id;
   #doctor;
   #filter;
   #fields;
   #formTitle;
   #modal;
   #results;
   #formErrors;

   constructor() {
      super();
      
      this.#id = null;     
   }

   initFields() {
      return new Promise((resolve) => {
         this.#fields = {
            filter: new OneWayCollectionProp([]),
            form: new OneWayCollectionProp([])
         };
   
         this.#fields.filter.subscribe(document.forms.filter.field);
         this.#fields.form.subscribe(document.forms.createUpdate.field);
   
         FieldService.list((result) => {
            this.#fields.filter.value = [{ id: '', name: 'Todos' }, ...result.data];
            this.#fields.form.value = result.data;
            resolve();
         });
      });
   }

   initFilter() {
      this.#filter = {
         documentId: new TwoWayProp(null, 'string'),
         firstName: new TwoWayProp(null, 'string'),
         lastName: new TwoWayProp(null, 'string'),
         fieldId: new TwoWayProp(null, 'number')
      };

      this.#filter.documentId.subscribe(document.forms.filter.documentId);
      this.#filter.firstName.subscribe(document.forms.filter.firstName);
      this.#filter.lastName.subscribe(document.forms.filter.lastName);
      this.#filter.fieldId.subscribe(document.forms.filter.field);

      document.querySelector('[data-search]').addEventListener('click', () => {
         this.searchDoctors();
      });
   }

   initDoctor() {
      this.#doctor = {
         documentId: new TwoWayProp(null, 'string'),
         firstName: new TwoWayProp(null, 'string'),
         lastName: new TwoWayProp(null, 'string'),
         fieldId: new TwoWayProp(this.#fields.form.value[0]?.id, 'number')
      };

      this.#doctor.documentId.subscribe(document.forms.createUpdate.documentId);
      this.#doctor.firstName.subscribe(document.forms.createUpdate.firstName);
      this.#doctor.lastName.subscribe(document.forms.createUpdate.lastName);
      this.#doctor.fieldId.subscribe(document.forms.createUpdate.field);
   }

   initModal() {
      this.#formTitle = new OneWayProp(null, 'string');
      this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

      this.#formErrors = new OneWayCollectionProp([]);
      this.#formErrors.subscribe(document.querySelector('[data-form-errors]'));

      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         this.#doctor.documentId.value = null;
         this.#doctor.firstName.value = null;
         this.#doctor.lastName.value = null;
         this.#doctor.fieldId.value = this.#fields.form.value[0].id;
         this.#formTitle.value = null;
         this.#formErrors.value = [];
      });

      document.querySelector('[data-new]').addEventListener('click', () => {
         this.#formTitle.value = 'Nuevo Doctor';
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
               DoctorService.get(id, (result) => {
                  const doctor = result.data;
                  this.#id = doctor.id;
                  this.#doctor.documentId.value = doctor.documentId;
                  this.#doctor.firstName.value = doctor.firstName;
                  this.#doctor.lastName.value = doctor.lastName;
                  this.#doctor.fieldId.value = doctor.field.id;
                  this.#formTitle.value = 'Editar Doctor';
                  this.#modal.open();
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  DoctorService.delete(id, (result) => {
                     if (result.success) {
                        this.searchDoctors();
                     } else {
                        let errors = '';

                        for(const error of result.messages) {
                           errors += `${error}\n`;
                        }

                        if(errors != '') {
                           alert(errors);
                        }
                     }
                  })
               }
               break;
         }
      });

      this.#results = new OneWayCollectionProp([]);
      this.#results.subscribe(results);
   }

   #save() {
      const data = {
         documentId: this.#doctor.documentId.value,
         firstName: this.#doctor.firstName.value,
         lastName: this.#doctor.lastName.value,
         fieldId: this.#doctor.fieldId.value
      };

      const afterSave = (result) => {
         if(result.success) {
            const doctor = result.data;
            this.#modal.close();
            this.#filter.documentId.value = doctor.documentId;
            this.#filter.firstName.value = null;
            this.#filter.lastName.value = null;
            this.#filter.fieldId.value = null;
            this.searchDoctors();
         } else {
            this.#formErrors.value = result.messages;
         }
      };

      this.#formErrors.value = [];
      if (this.#id == null) {
         DoctorService.insert(data, afterSave);
      } else {
         DoctorService.update(this.#id, data, afterSave);
      }
   }

   searchDoctors() {
      const filter = {
         documentId: this.#filter.documentId.value,
         firstName: this.#filter.firstName.value,
         lastName: this.#filter.lastName.value,
         fieldId: this.#filter.fieldId.value
      };

      DoctorService.list(filter, (result) => {
         this.#results.value = result.data;
      });
   }
}

const viewModel = new ViewModel();

/* Para inicializar ciertos valores se necesitan cargar la lista de datos de especialidades */
Promise.all([
   viewModel.initFields()
]).then(() => {
   viewModel.initFilter();
   viewModel.initDoctor();
   viewModel.initModal();
   viewModel.initResults();

   viewModel.searchDoctors();
}); 