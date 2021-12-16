import { Modal } from '../controls/modal.js';
import { Panel } from "../controls/panel.js";
import { FieldService } from '../services/field.js';
import { BaseViewModel } from "./base.js";
import { AppointmentService } from '../services/appointment.js';
import { PatientService } from '../services/patient.js';
import { DoctorService } from '../services/doctor.js';
import { DateService } from '../services/date.js';

class ViewModel extends BaseViewModel {
    #panels;
    #modal;
    #results;
    #doctorSearchResults;
    #patientSearchResults;
    #id;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));
        
        this.#id = null;

        this.#initPanels();
        this.#initModal();
        this.#initFields();
        this.#initFilter();
        this.#initSearches();
    }

    #initPanels() {
        this.#panels = [];

        for(const panel of document.querySelectorAll('[data-panel]')) {
            this.#panels.push(new Panel(panel.querySelector('[data-toggle]'), panel.querySelector('[data-toggle-section]')));
        }
    }

    #initModal() {
        this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.#id = null;
            document.forms.createUpdate.doctor.value = null;
            document.forms.createUpdate.patient.value = null;
            document.forms.createUpdate.date.value = null;

            //Al cerrar el modal y resetear los valores se deben vaciar
            //las listas de búsqueda para no dejar remanentes
            this.#doctorSearchResults.innerHTML = '';
            this.#patientSearchResults.innerHTML = '';
        });

        document.querySelector('[data-new]').addEventListener('click', () => { 
            document.querySelector('[data-form-title]').textContent = 'Nueva Cita';
            this.#modal.open() 
        });
        document.querySelector('[data-save]').addEventListener('click', () => { this.#save() });
        document.querySelector('[data-cancel]').addEventListener('click', () => { this.#modal.close() });

        //Results table uses modal so it inits after modal
        this.#initResults();
    }

    #initResults() {
        this.#results = document.querySelector('[data-results]');
        this.#results.addEventListener('click', (e) => {
            const element = e.target;

            if(element.matches('[data-click]')) {
                switch(element.getAttribute('data-click')) {
                    case 'edit':
                        const id = element.getAttribute('data-id');
                        AppointmentService.get(id, (result) => {
                            if(result != null) {
                                this.#id = result.id;

                                //Hay que utilizar el servicio de doctor para obtener los detalles ya que por medio de la cita sólo se tiene el id
                                DoctorService.get(result.doctorId, (doctor) => {
                                    if(doctor != null) {
                                        //Debido a que al cargar el formulario la lista de resultados está vacía
                                        //Es necesario realizar una búsqueda que traiga de vuelta el resultado
                                        //seleccionado (por medio de la cédula aseguramos que esa opción esté).
                                        //Luego hay que llenar el valor del campo de texto de manera similar a como se llena
                                        //como cuando se escoge una opción de los resultados
                                        this.#searchDoctors(doctor.documentId);
                                        document.forms.createUpdate.doctor.value = '(' + doctor.documentId + ') ' + doctor.firstName + ' ' + doctor.lastName;
                                    }
                                });

                                //Hay que utilizar el servicio de paciente para obtener los detalles ya que por medio de la cita sólo se tiene el id
                                PatientService.get(result.patientId, (patient) => {
                                    if(patient != null) {
                                        //Debido a que al cargar el formulario la lista de resultados está vacía
                                        //Es necesario realizar una búsqueda que traiga de vuelta el resultado
                                        //seleccionado (por medio de la cédula aseguramos que esa opción esté).
                                        //Luego hay que llenar el valor del campo de texto de manera similar a como se llena
                                        //como cuando se escoge una opción de los resultados
                                        this.#searchPatients(patient.documentId);
                                        document.forms.createUpdate.patient.value = '(' + patient.documentId + ') ' + patient.firstName + ' ' + patient.lastName;
                                    }
                                });

                                document.forms.createUpdate.date.value = DateService.toInputDateString(result.date);
                                document.querySelector('[data-form-title]').textContent = 'Editar Cita';
                                this.#modal.open();
                            } else {
                                alert('No se pudo cargar el registro seleccionado');
                            }
                        });
                        break;
                    case 'delete':
                        if(confirm('Desea borrar esta entrada?')) {
                            const id = element.getAttribute('data-id');
                            AppointmentService.delete(id, (result) => {
                                if(result) {
                                    this.#searchAppointments();
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
            this.#populateFields(document.querySelector('[data-filter="fields"]'), fields, true);
        });
    }

    #populateFields(select, fields, useAll) {
        if(useAll) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'Todos';
            select.appendChild(option);
        }

        for(let i = 0; i < fields.length; i++) {
            const option = document.createElement('option');
            option.value = fields[i].id;
            option.textContent = fields[i].name;

            select.appendChild(option);
        }
    }

    #initFilter() {
        document.querySelector('[data-search]').addEventListener('click', () => { this.#searchAppointments() });
        this.#searchAppointments();
    }

    #initSearches() {
        this.#doctorSearchResults = document.querySelector('[data-autocomplete-results="doctors"]');
        this.#patientSearchResults = document.querySelector('[data-autocomplete-results="patients"]');

        //Filtra resultados cada vez que se escribe sobre el campo de texto (no necesita un botón para buscar)
        document.querySelector('[data-autocomplete="doctors"]').addEventListener('input', (e) => {
            //Previene rebuscar cuando se selecciona una opción de la lista
            //Tambén evita un defecto visual que hace que al rebuscar la lista no desaparezca después de seleccionar
            //Explicación en https://stackoverflow.com/a/68087847
            if (!(e instanceof InputEvent) || e.inputType == 'insertReplacementText') {
                return;
            }

            //Para datos reales controlar cuando se busca, trabar durante búsqueda
            this.#searchDoctors(e.target.value);
        });

        //Filtra resultados cada vez que se escribe sobre el campo de texto (no necesita un botón para buscar)
        document.querySelector('[data-autocomplete="patients"]').addEventListener('input', (e) => {
            //Previene rebuscar cuando se selecciona una opción de la lista
            //Tambén evita un defecto visual que hace que al rebuscar la lista no desaparezca después de seleccionar
            //Explicación en https://stackoverflow.com/a/68087847
            if (!(e instanceof InputEvent) || e.inputType == 'insertReplacementText') {
                return;
            }

            //Para datos reales controlar cuando se busca, trabar durante búsqueda
            this.#searchPatients(e.target.value);
        })
    }

    #save() {
        const date = document.forms.createUpdate.date.value;

        //Los ids se retraen del valor textual del input mapeado a la opción cuyo atributo "value" tenga el mismo valor.
        //Una vez retraído el elemento específico se puede sacar el id que se encuentra en el atributo data-id
        const doctorId = this.#doctorSearchResults.querySelector('[value="' + document.forms.createUpdate.doctor.value + '"]').getAttribute('data-id');
        const patientId = this.#patientSearchResults.querySelector('[value="' + document.forms.createUpdate.patient.value + '"]').getAttribute('data-id');

        const data = {
            doctorId: doctorId,
            patientId: patientId,
            date: date ? new Date(date) : null
        };

        if(this.#id == null) {
            AppointmentService.create(data, (result) => {
                if(result != null) {
                    this.#modal.close();
                    this.#searchAppointments();
                } else {
                    alert('No se pudo crear el nuevo registro');
                }
            });
        } else {
            AppointmentService.update(this.#id, data, (result) => {
                if(result != null) {
                    this.#modal.close();
                    this.#searchAppointments();
                } else {
                    alert('No se pudo actualizar el registro');
                }
            });
        }
    }

    #searchDoctors(search) {
        //De un string completo separamos a una colección de filtros varios.
        //Cada item de la colección es la separación del string completo por cada espacio en blanco.
        //La función filter sólo incluye los valores de la colección original que no sean string vacío o nulo
        //La función trim elimina espacios en blanco a la derecha e izquiera para no ignorar multiples espacios en blanco
        const filters = search.split(' ').filter((filter) => filter.trim());;

        DoctorService.search(filters, (result) => {
            this.#doctorSearchResults.innerHTML = '';

            for(const doctor of result) {
                //Nueva opción
                const option = document.createElement('option');
                option.setAttribute('data-id', doctor.id);
                option.value = '(' + doctor.documentId + ') ' + doctor.firstName + ' ' + doctor.lastName;
                option.textContent = doctor.field;

                //Agregar opción completa a la lista de doctores
                this.#doctorSearchResults.appendChild(option);
            }
        });
    }

    #searchPatients(search) {
        //De un string completo separamos a una colección de filtros varios.
        //Cada item de la colección es la separación del string completo por cada espacio en blanco.
        //La función filter sólo incluye los valores de la colección original que no sean string vacío o nulo
        //La función trim elimina espacios en blanco a la derecha e izquiera para no ignorar multiples espacios en blanco
        const filters = search.split(' ').filter((filter) => filter.trim());

        PatientService.search(filters, (result) => {
            this.#patientSearchResults.innerHTML = '';

            for(const patient of result) {
                //Nueva opción
                const option = document.createElement('option');
                option.setAttribute('data-id', patient.id);
                option.value = '(' + patient.documentId + ') ' + patient.firstName + ' ' + patient.lastName;

                //Agregar opción completa a la lista de doctores
                this.#patientSearchResults.appendChild(option);
            }
        });
    }

    #searchAppointments() {
        let gender = null;

        switch(document.forms.filterPatient.gender.value) {
            case 'true':
                gender = true;
                break;
            case 'false':
                gender = false;
                break;
        }

        const dateFrom = document.forms.filter.dateFrom.value;
        const dateTo = document.forms.filter.dateTo.value;
        const birthDateFrom = document.forms.filterPatient.birthDateFrom.value;
        const birthDateTo = document.forms.filterPatient.birthDateTo.value;
        const filter = {
            dateFrom: dateFrom ? new Date(dateFrom) : null,
            dateTo: dateTo ? new Date(dateTo) : null,
            doctor: {
                documentId: document.forms.filterDoctor.documentId.value,
                firstName: document.forms.filterDoctor.firstName.value,
                lastName: document.forms.filterDoctor.lastName.value,
                fieldId: document.forms.filterDoctor.field.value
            },
            patient: {
                documentId: document.forms.filterPatient.documentId.value,
                firstName: document.forms.filterPatient.firstName.value,
                lastName: document.forms.filterPatient.lastName.value,
                gender: gender,
                birthDateFrom: birthDateFrom ? new Date(birthDateFrom) : null,
                birthDateTo: birthDateTo ? new Date(birthDateTo) : null
            }
        };

        AppointmentService.list(filter, (result) => {
            this.#results.innerHTML = '';

            for(const appointment of result) {
                let patientResult;
                let doctorResult;
                PatientService.get(appointment.patientId, (result) => {
                    patientResult = result;
                });

                DoctorService.get(appointment.doctorId, (result) => {
                    doctorResult = result;
                });

                //Nueva fila
                const row = document.createElement('tr');

                //Celda fecha
                const date = document.createElement ('td');
                date.textContent = appointment.date.toLocaleString('es-ES', { hour12: true});
                row.appendChild(date);
                
                //Celda paciente
                const patient = document.createElement('td');
                patient.textContent = patientResult.firstName + ' ' + patientResult.lastName;
                row.appendChild(patient);

                //Celda doctor
                const doctor = document.createElement('td');
                doctor.textContent = doctorResult.firstName + ' ' + doctorResult.lastName;
                row.appendChild(doctor);

                //Celda especialidad
                const field = document.createElement('td');
                field.textContent = doctorResult.field;
                row.appendChild(field);

                //Celda de botones
                const buttons = document.createElement('td');
                buttons.classList.add('buttons');

                //Botón editar
                const editButton = document.createElement('button');
                editButton.classList.add('button');
                editButton.classList.add('success');
                editButton.setAttribute('data-click', 'edit');
                editButton.setAttribute('data-id', appointment.id);
                editButton.textContent = 'Editar';
                buttons.appendChild(editButton);

                //Botón borrar
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('button');
                deleteButton.classList.add('danger');
                deleteButton.setAttribute('data-click', 'delete');
                deleteButton.setAttribute('data-id', appointment.id);
                deleteButton.textContent = 'Borrar';
                buttons.appendChild(deleteButton);

                row.appendChild(buttons);

                //Celda móvil, estructura interna no tabular
                const mobile = document.createElement('td');
                mobile.classList.add('mobile');

                //Cédula móvil
                const mobileTitle = document.createElement('h3');
                mobileTitle.textContent = appointment.date.toLocaleString('es-ES', { hour12: true});
                mobile.appendChild(mobileTitle);

                //Paciente móvil
                const mobilePatient = document.createElement('p');
                const mobilePatientSpan = document.createElement('span');
                mobilePatientSpan.classList.add('label');
                mobilePatientSpan.textContent = 'Paciente:';
                mobilePatient.appendChild(mobilePatientSpan);
                mobilePatient.appendChild(document.createTextNode(patientResult.firstName + ' ' + patientResult.lastName));
                mobile.appendChild(mobilePatient);
                
                //Doctor móvil
                const mobileDoctor = document.createElement('p');
                const mobileDoctorSpan = document.createElement('span');
                mobileDoctorSpan.classList.add('label');
                mobileDoctorSpan.textContent = 'Doctor:';
                mobileDoctor.appendChild(mobileDoctorSpan);
                mobileDoctor.appendChild(document.createTextNode(doctorResult.firstName + ' ' + doctorResult.lastName));
                mobile.appendChild(mobileDoctor);

                //Especialidad móvil
                const mobileField = document.createElement('p');
                const mobileFieldSpan = document.createElement('span');
                mobileFieldSpan.classList.add('label');
                mobileFieldSpan.textContent = 'Especialidad:';
                mobileField.appendChild(mobileFieldSpan);
                mobileField.appendChild(document.createTextNode(doctorResult.field));
                mobile.appendChild(mobileField);

                //Contenedor de botones móvil
                const mobileDiv = document.createElement('div');

                //Botón editar móvil
                const mobileEditButton = document.createElement('button');
                mobileEditButton.classList.add('button');
                mobileEditButton.classList.add('success');
                mobileEditButton.setAttribute('data-click', 'edit');
                mobileEditButton.setAttribute('data-id', appointment.id);
                mobileEditButton.textContent = 'Editar';
                mobileDiv.appendChild(mobileEditButton);

                //Botón borrar móvil
                const mobileDeleteButton = document.createElement('button');
                mobileDeleteButton.classList.add('button');
                mobileDeleteButton.classList.add('danger');
                mobileDeleteButton.setAttribute('data-click', 'delete');
                mobileDeleteButton.setAttribute('data-id', appointment.id);
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