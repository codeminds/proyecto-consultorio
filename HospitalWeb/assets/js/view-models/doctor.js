import { Modal } from '../controls/modal.js';
import { Panel } from '../controls/panel.js';
import { DoctorService } from '../services/doctor.js';
import { FieldService } from '../services/field.js';
import { BaseViewModel } from './base.js';

class ViewModel extends BaseViewModel{
    #panel;
    #modal;
    #results;
    #id;

    constructor() {
        //Inicializar clase padre BaseViewModel
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        this.#id = null;

        //Inicializar todos los controles
        this.#initPanel();
        this.#initModal();
        this.#initFields();
        this.#initFilter();
    }

    #initPanel() {
        this.#panel = new Panel(document.querySelector('[data-toggle]'), document.querySelector('[data-toggle-section]'));
    }

    #initModal() {
        this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.#id = null;
            document.forms.createUpdate.documentId.value = null;
            document.forms.createUpdate.firstName.value = null;
            document.forms.createUpdate.lastName.value = null;
            document.forms.createUpdate.field.selectedIndex = 0;
            document.querySelector('[data-form-title]').textContent = null;
        });
        document.querySelector('[data-new]').addEventListener('click', () => { 
            document.querySelector('[data-form-title]').textContent = 'Nuevo Doctor';
            this.#modal.open() 
        });
        document.querySelector('[data-save]').addEventListener('click', () => { this.#save(); });
        document.querySelector('[data-cancel]').addEventListener('click', () => { this.#modal.close() });

        //Una vez inicializado el modal, inicializar la tabla de resultados que dependen de él
        this.#initResults();
    }

    #initResults() {
        this.#results = document.querySelector('[data-results]');

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
                                document.forms.createUpdate.documentId.value = result.documentId;
                                document.forms.createUpdate.firstName.value = result.firstName;
                                document.forms.createUpdate.lastName.value = result.lastName;
                                document.forms.createUpdate.field.value = result.fieldId;
                                document.querySelector('[data-form-title]').textContent = 'Editar Doctor';
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
        FieldService.list((fields) => {
            //Popular especializaciones en filtro de búsqueda incluyendo la opción vacía "Todos"
            this.#populateFields(document.querySelector('[data-filter="fields"]'), fields, true);

            //Popular especializaciones en formulario de crear/editar de búsqueda sin la opción vacía "Todos"
            this.#populateFields(document.querySelector('[data-form="fields"]'), fields, false);
        });
    }

    #populateFields(select, fields, useAll) {
        //Create opción adicional "Todos" si useAll es true
        if(useAll) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Todos';
            select.appendChild(option);
        }

        //Por cada especialización crear una opción en el dropdown
        for(let i = 0; i < fields.length; i++) {
            const option = document.createElement('option');
            option.value = fields[i].id;
            option.textContent = fields[i].name;

            select.appendChild(option);
        }
    }

    #initFilter() {
        document.querySelector('[data-search]').addEventListener('click', () => { this.#searchDoctors() });

        //Hacer una búsqueda inicial para mostrar resultados en la carga de la página
        this.#searchDoctors();
    }

    #save() {
        const data = {
            documentId: document.forms.createUpdate.documentId.value,
            firstName: document.forms.createUpdate.firstName.value,
            lastName: document.forms.createUpdate.lastName.value,
            fieldId: document.forms.createUpdate.field.value
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
            documentId: document.forms.filter.documentId.value,
            firstName: document.forms.filter.firstName.value,
            lastName: document.forms.filter.lastName.value,
            fieldId: document.forms.filter.field.value
        };

        DoctorService.list(filter, (result) => {
            //Remover resultados anteriores del HTML
            this.#results.innerHTML = '';

            //Por cada doctor crear una nueva fila en la tabla con toda su estructura
            //de datos tabulares y la celda móvil para dispositivos pequeños
            for(const doctor of result) {
                //Nueva fila
                const row = document.createElement('tr');
                
                //Celda cédula
                const documentId = document.createElement('td');
                documentId.textContent = doctor.documentId;
                row.appendChild(documentId);

                //Celda nombre
                const name = document.createElement('td');
                name.textContent = doctor.firstName + ' ' + doctor.lastName;
                row.appendChild(name);

                //Celda especialidad
                const field = document.createElement('td');
                field.textContent = doctor.field;
                row.appendChild(field);

                //Celda de botones
                const buttons = document.createElement('td');
                buttons.classList.add('buttons');

                //Botón editar
                const editButton = document.createElement('button');
                editButton.classList.add('button');
                editButton.classList.add('success');
                editButton.setAttribute('data-click', 'edit');
                editButton.setAttribute('data-id', doctor.id);
                editButton.textContent = 'Editar';
                buttons.appendChild(editButton);

                //Botón borrar
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('button');
                deleteButton.classList.add('danger');
                deleteButton.setAttribute('data-click', 'delete');
                deleteButton.setAttribute('data-id', doctor.id);
                deleteButton.textContent = 'Borrar';
                buttons.appendChild(deleteButton);

                row.appendChild(buttons);

                //Celda móvil, estructura interna no tabular
                const mobile = document.createElement('td');
                mobile.classList.add('mobile');

                //Cédula móvil
                const mobileTitle = document.createElement('h3');
                mobileTitle.textContent = doctor.documentId;
                mobile.appendChild(mobileTitle);

                //Nombre móvil
                const mobileName = document.createElement('p');
                const mobileNameSpan = document.createElement('span');
                mobileNameSpan.classList.add('label');
                mobileNameSpan.textContent = 'Nombre:';
                mobileName.appendChild(mobileNameSpan);
                mobileName.appendChild(document.createTextNode(doctor.firstName + ' ' + doctor.lastName));
                mobile.appendChild(mobileName);

                //Especialidad móvil
                const mobileField = document.createElement('p');
                const mobileFieldSpan = document.createElement('span');
                mobileFieldSpan.classList.add('label');
                mobileFieldSpan.textContent = 'Especialidad:';
                mobileField.appendChild(mobileFieldSpan);
                mobileField.appendChild(document.createTextNode(doctor.field));
                mobile.appendChild(mobileField);

                //Contenedor de botones móvil
                const mobileDiv = document.createElement('div');

                //Botón editar móvil
                const mobileEditButton = document.createElement('button');
                mobileEditButton.classList.add('button');
                mobileEditButton.classList.add('success');
                mobileEditButton.setAttribute('data-click', 'edit');
                mobileEditButton.setAttribute('data-id', doctor.id);
                mobileEditButton.textContent = 'Editar';
                mobileDiv.appendChild(mobileEditButton);

                //Botón borrar móvil
                const mobileDeleteButton = document.createElement('button');
                mobileDeleteButton.classList.add('button');
                mobileDeleteButton.classList.add('danger');
                mobileDeleteButton.setAttribute('data-click', 'delete');
                mobileDeleteButton.setAttribute('data-id', doctor.id);
                mobileDeleteButton.textContent = 'Borrar';
                mobileDiv.appendChild(mobileDeleteButton);

                mobile.appendChild(mobileDiv);
                row.appendChild(mobile);

                //Agregar fila completa con todos las celdas a la tabla
                this.#results.appendChild(row);
            }
        });
    }
}

let viewModel;
window.addEventListener('load', () => {
   viewModel = new ViewModel();
});
