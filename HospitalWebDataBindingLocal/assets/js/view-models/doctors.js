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

   constructor() {
      super();

      this.#initFields();
      this.#initFilter();
      this.#initDoctor();
      this.#initModal();
      this.#initResults();

      this.#searchDoctors();
   }

   #initFields() {
      this.#fields = {
         filter: new OneWayCollectionProp([]),
         form: new OneWayCollectionProp([])
      };

      this.#fields.filter.subscribe(document.forms.filter.field);
      this.#fields.form.subscribe(document.forms.insertUpdate.field);

      FieldService.list((fields) => {
         this.#fields.filter.value = [{ id: '', name: 'Todos' }, ...fields];
         this.#fields.form.value = fields;
      });
   }

   #initFilter() {
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
         this.#searchDoctors();
      });
   }

   #initDoctor() {
      this.#id = null;

      this.#doctor = {
         documentId: new TwoWayProp(null, 'string'),
         firstName: new TwoWayProp(null, 'string'),
         lastName: new TwoWayProp(null, 'string'),
         fieldId: new TwoWayProp(this.#fields.form.value[0].id, 'number')
      };

      this.#doctor.documentId.subscribe(document.forms.insertUpdate.documentId);
      this.#doctor.firstName.subscribe(document.forms.insertUpdate.firstName);
      this.#doctor.lastName.subscribe(document.forms.insertUpdate.lastName);
      this.#doctor.fieldId.subscribe(document.forms.insertUpdate.field);
   }

   #initModal() {
      this.#formTitle = new OneWayProp(null, 'string');
      this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

      this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
         this.#id = null;
         this.#doctor.documentId.value = null;
         this.#doctor.firstName.value = null;
         this.#doctor.lastName.value = null;
         this.#doctor.fieldId.value = this.#fields.form.value[0].id;
         this.#formTitle.value = null;
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

   #initResults() {
      const results = document.querySelector('[data-results]');
      results.addEventListener('click', (e) => {
         switch (e.target.getAttribute('data-click')) {
            case 'edit':
               const id = e.target.getAttribute('data-id');
               DoctorService.get(id, (doctor) => {
                  if (doctor != null) {
                     this.#id = doctor.id;
                     this.#doctor.documentId.value = doctor.documentId;
                     this.#doctor.firstName.value = doctor.firstName;
                     this.#doctor.lastName.value = doctor.lastName;
                     this.#doctor.fieldId.value = doctor.fieldId;
                     this.#formTitle.value = 'Editar Doctor';
                     this.#modal.open();
                  } else {
                     alert('No se pudo cargar el registro seleccionado');
                  }
               });
               break;
            case 'delete':
               if (confirm('Desea borrar esta entrada?')) {
                  const id = e.target.getAttribute('data-id');
                  DoctorService.delete(id, (deleted) => {
                     if (deleted) {
                        this.#searchDoctors();
                     } else {
                        alert('No se pudo borrar la entrada');
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
         fieldId: this.#doctor.field.value
      };

      if (this.#id == null) {
         DoctorService.insert(data, (doctor) => {
            this.#modal.close();
            this.#filter.documentId.value = doctor.documentId;
            this.#filter.firstName.value = null;
            this.#filter.lastName.value = null;
            this.#filter.field.value = null;
            this.#searchDoctors();
         });
      } else {
         DoctorService.update(this.#id, data, (doctor) => {
            if (doctor != null) {
               this.#modal.close();
               this.#filter.documentId.value = doctor.documentId;
               this.#filter.firstName.value = null;
               this.#filter.lastName.value = null;
               this.#filter.field.value = null;
               this.#searchDoctors();
            } else {
               alert('No se pudo actualizar el registro');
            }
         });
      }
   }

   #searchDoctors() {
      const filter = {
         documentId: this.#filter.documentId.value,
         firstName: this.#filter.firstName.value,
         lastName: this.#filter.lastName.value,
         fieldId: this.#filter.fieldId.value
      };

      DoctorService.list(filter, (doctors) => {
         this.#results.value = doctors;
      });
   }
}

const viewModel = new ViewModel();