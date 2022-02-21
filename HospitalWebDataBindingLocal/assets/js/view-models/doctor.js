import { Modal } from '../controls/modal.js';
import { Panel } from '../controls/panel.js';
import { OneWayCollectionProp, OneWayProp, TwoWayProp } from '../data-bind.js';
import { DoctorService } from '../services/doctor.js';
import { FieldService } from '../services/field.js';
import { BaseViewModel } from './base.js';

class ViewModel extends BaseViewModel{
    #panel;
    #modal;
    #results;
    #id;
    #filter;
    #doctors;
    #doctor;
    #formFields;
    #filterFields;
    #formTitle;

    constructor() {
        //Inicializar clase padre BaseViewModel
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        //Inicializar todos los controles
        this.#initDoctor();
        this.#initPanel();
        this.#initModal();
        this.#initFields();
        this.#initFilter();
    }

    #initDoctor() {
        this.#id = null;
        this.#doctor = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            field: new TwoWayProp(null, 'string')
        };

        this.#doctor.documentId.subscribe(document.forms.createUpdate.documentId);
        this.#doctor.firstName.subscribe(document.forms.createUpdate.firstName);
        this.#doctor.lastName.subscribe(document.forms.createUpdate.lastName);
        this.#doctor.field.subscribe(document.forms.createUpdate.field);
    }

    #initPanel() {
        this.#panel = new Panel(document.querySelector('[data-toggle]'), document.querySelector('[data-toggle-section]'));
    }

    #initModal() {
        this.#formTitle = new OneWayProp(null, 'string');
        this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

        this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.#id = null;
            this.#doctor.documentId.value = null;
            this.#doctor.firstName.value = null;
            this.#doctor.lastName.value = null;
            this.#doctor.field.value = this.#formFields.value[0].id;
            this.#formTitle.value = null;
        });
        document.querySelector('[data-new]').addEventListener('click', () => { 
            this.#formTitle.value = 'Nuevo Doctor';
            this.#modal.open() 
        });
        document.querySelector('[data-save]').addEventListener('click', () => { this.#save(); });
        document.querySelector('[data-cancel]').addEventListener('click', () => { this.#modal.close() });

        //Una vez inicializado el modal, inicializar la tabla de resultados que dependen de él
        this.#initResults();
    }

    #initResults() {
        this.#results = document.querySelector('[data-results]');
        this.#doctors = new OneWayCollectionProp([]);
        this.#doctors.subscribe(this.#results);

        //Delegar evento de los botones en la tabla a uno sólo utilizando el
        //contenedor de todos los resultados como delegador
        this.#results.addEventListener('click', (e) => {
            const element = e.target;

            //Convertir evento en una acción sólo para elementos con el atributo data-click
            if(element.matches('[data-click]')) {
                switch(element.getAttribute('data-click')) {
                    case 'edit':
                        const id = element.getAttribute('data-id');
                        DoctorService.get(id, (result) => {
                            if(result != null) {
                                this.#id = result.id;
                                this.#doctor.documentId.value = result.documentId;
                                this.#doctor.firstName.value = result.firstName;
                                this.#doctor.lastName.value = result.lastName;
                                this.#doctor.field.value = result.fieldId;
                                this.#formTitle.value = 'Editar Doctor';
                                this.#modal.open();
                            } else {
                                alert('No se pudo cargar el registro seleccionado');
                            }
                        });
                        break;
                    case 'delete':
                        if(confirm('Desea borrar esta entrada?')) {
                            const id = element.getAttribute('data-id');
                            DoctorService.delete(id, (result) => {
                                if(result) {
                                    this.#searchDoctors();
                                } else {
                                    alert('No se pudo borrar la entrada');
                                }
                            });
                        }
                        break;
                }
            }
        });
    }

    #initFields() {
        this.#formFields = new OneWayCollectionProp([]);
        this.#formFields.subscribe(document.forms.createUpdate.field);

        this.#filterFields = new OneWayCollectionProp([]);
        this.#filterFields.subscribe(document.forms.filter.field);

        FieldService.list((fields) => {
            this.#formFields.value = fields;
            this.#filterFields.value = [{ id: '', name: 'Todos'}, ...fields];
        });
    }

    #initFilter() {
        this.#filter = {
            documentId: new TwoWayProp(null, 'string'),
            firstName: new TwoWayProp(null, 'string'),
            lastName: new TwoWayProp(null, 'string'),
            field: new TwoWayProp(null, 'number') 
        };

        this.#filter.documentId.subscribe(document.forms.filter.documentId);
        this.#filter.firstName.subscribe(document.forms.filter.firstName);
        this.#filter.lastName.subscribe(document.forms.filter.lastName);
        this.#filter.field.subscribe(document.forms.filter.field);

        document.querySelector('[data-search]').addEventListener('click', () => { this.#searchDoctors() });

        //Hacer una búsqueda inicial para mostrar resultados en la carga de la página
        this.#searchDoctors();
    }

    #save() {
        const data = {
            documentId: this.#doctor.documentId.value,
            firstName: this.#doctor.firstName.value,
            lastName: this.#doctor.lastName.value,
            fieldId: this.#doctor.field.value
        };

        if(this.#id == null) {
            DoctorService.create(data, (result) => {
                if(result != null) {
                    this.#modal.close();
                    this.#searchDoctors();
                } else {
                    alert('No se pudo crear el nuevo registro');
                }
            });
        } else {
            DoctorService.update(this.#id, data, (result) => {
                if(result != null) {
                    this.#modal.close();
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
            fieldId: this.#filter.field.value
        };

        DoctorService.list(filter, (result) => {
            this.#doctors.value = result;
        });
    }
}

let viewModel;
window.addEventListener('load', () => {
   viewModel = new ViewModel();
});