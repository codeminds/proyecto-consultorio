import { Modal } from '../controls/modal.js';
import { Panel } from "../controls/panel.js";
import { OneWayCollectionProp, OneWayProp, TwoWayProp } from '../data-bind.js';
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
    #doctorSearch;
    #doctorSearchResults;
    #patientSearch;
    #patientSearchResults;
    #id;
    #filter;
    #filterFields;
    #appointments;
    #appointment;
    #formTitle;
    #formErrors;
    #searchTimeout;

    constructor() {
        super(document.querySelector('[data-menu]'), document.querySelector('[data-menu-button]'));

        this.#initAppointment();
        this.#initPanels();
        this.#initModal();
        this.#initFields();
        this.#initFilter();
        this.#initSearches();
    }

    #initAppointment() {
        this.#id = null;
        this.#appointment = {
            doctorId: new OneWayProp(null, 'string'),
            patientId: new OneWayProp(null, 'string'),
            date: new TwoWayProp (null, 'date', {
                toInputString: (value) => {
                    return DateService.toInputDateString(value);
                }
            })
        };

        this.#doctorSearch = new OneWayProp(null, 'string');
        this.#patientSearch = new OneWayProp(null, 'string');

        this.#appointment.date.subscribe(document.forms.createUpdate.date);
        this.#doctorSearch.subscribe(document.forms.createUpdate.doctorSearch);
        this.#patientSearch.subscribe(document.forms.createUpdate.patientSearch);
    }

    #initPanels() {
        this.#panels = [];

        for(const panel of document.querySelectorAll('[data-panel]')) {
            this.#panels.push(new Panel(panel.querySelector('[data-toggle]'), panel.querySelector('[data-toggle-section]')));
        }
    }

    #initModal() {
        this.#formTitle = new OneWayProp(null, 'string');
        this.#formTitle.subscribe(document.querySelector('[data-form-title]'));

        this.#formErrors = new OneWayCollectionProp([]);
        this.#formErrors.subscribe(document.querySelector('[data-errors]'));

        this.#modal = new Modal(document.querySelector('[data-modal]'), 'medium', () => {
            this.#id = null;
            this.#appointment.doctorId.value = null;
            this.#appointment.patientId.value = null;
            this.#appointment.date.value = null;
            this.#doctorSearch.value = null;
            this.#patientSearch.value = null;

            //Al cerrar el modal y resetear los valores se deben vaciar
            //las listas de búsqueda para no dejar remanentes
            this.#doctorSearchResults.value = [];
            this.#patientSearchResults.value = [];
            this.#formErrors.value = [];
        });

        document.querySelector('[data-new]').addEventListener('click', () => { 
            this.#formTitle.value = 'Nueva Cita';
            this.#modal.open() 
        });

        document.querySelector('[data-save]').addEventListener('click', () => { this.#save() });
        document.querySelector('[data-cancel]').addEventListener('click', () => { this.#modal.close() });

        //Results table uses modal so it inits after modal
        this.#initResults();
    }

    #initResults() {
        this.#results = document.querySelector('[data-results]');
        this.#appointments = new OneWayCollectionProp([], {
            toDisplayString: (value) => {
                return DateService.toDisplayLocaleString(new Date(value), 'es-US')
            }
        });
        this.#appointments.subscribe(this.#results);
        this.#results.addEventListener('click', (e) => {
            const element = e.target;

            if(element.matches('[data-click]')) {
                switch(element.getAttribute('data-click')) {
                    case 'edit':
                        const id = element.getAttribute('data-id');
                        AppointmentService.get(id, (result) => {
                            const appointment = result.data
                            
                            this.#id = appointment.id;
                            this.#appointment.doctorId.value = appointment.doctor.id;
                            this.#appointment.patientId.value = appointment.patient.id;
                            this.#appointment.date.value = appointment.date;
                            this.#doctorSearch.value = appointment.doctor.firstName + ' ' + appointment.doctor.lastName;
                            this.#patientSearch.value = appointment.patient.firstName + ' ' + appointment.patient.lastName;
                            this.#formTitle.value = 'Editar Cita';
                            this.#modal.open();
                        });
                        break;
                    case 'delete':
                        if(confirm('Desea borrar esta entrada?')) {
                            const id = element.getAttribute('data-id');
                            AppointmentService.delete(id, (result) => {
                                if(result.success) {
                                    this.#searchAppointments();
                                } else {
                                    let errors = '';

                                    for(let i = 0; i < result.messages.length; i++) {
                                        errors += result.messages[i] + '\n';
                                    }

                                    if(errors != '') {
                                        alert(errors);
                                    }
                                }
                            });
                        }
                    break;
                }
            }
        });
    }

    #initFields() {
        this.#filterFields = new OneWayCollectionProp([]);
        this.#filterFields.subscribe(document.forms.filterDoctor.field);

        FieldService.list((result) => {
            this.#filterFields.value = [{ id: '', name: 'Todos'}, ...result.data];
        });
    }

    #initFilter() {
        this.#filter = {
            doctor: {
                documentId: new TwoWayProp(null, 'string'),
                firstName: new TwoWayProp(null, 'string'),
                lastName: new TwoWayProp(null, 'string'),
                field: new TwoWayProp(null, 'number') 
            },
            patient: {
                documentId: new TwoWayProp(null, 'string'),
                firstName: new TwoWayProp(null, 'string'),
                lastName: new TwoWayProp(null, 'string'),
                birthDateFrom: new TwoWayProp(null, 'date'),
                birthDateTo: new TwoWayProp(null, 'date'),
                gender: new TwoWayProp(null, 'boolean')
            },
            dateFrom: new TwoWayProp(null, 'date'),
            dateTo: new TwoWayProp(null, 'date')
        };

        this.#filter.doctor.documentId.subscribe(document.forms.filterDoctor.documentId);
        this.#filter.doctor.firstName.subscribe(document.forms.filterDoctor.firstName);
        this.#filter.doctor.lastName.subscribe(document.forms.filterDoctor.lastName);
        this.#filter.doctor.field.subscribe(document.forms.filterDoctor.field);
        this.#filter.patient.documentId.subscribe(document.forms.filterPatient.documentId);
        this.#filter.patient.firstName.subscribe(document.forms.filterPatient.firstName);
        this.#filter.patient.lastName.subscribe(document.forms.filterPatient.lastName);
        this.#filter.patient.birthDateFrom.subscribe(document.forms.filterPatient.birthDateFrom);
        this.#filter.patient.birthDateTo.subscribe(document.forms.filterPatient.birthDateTo);
        this.#filter.patient.gender.subscribe(document.forms.filterPatient.gender);
        this.#filter.dateFrom.subscribe(document.forms.filter.dateFrom);
        this.#filter.dateTo.subscribe(document.forms.filter.dateTo);

        document.querySelector('[data-search]').addEventListener('click', () => { this.#searchAppointments() });
        this.#searchAppointments();
    }

    #initSearches() {
        this.#doctorSearchResults = new OneWayCollectionProp([]);
        this.#patientSearchResults = new OneWayCollectionProp([]);

        this.#doctorSearchResults.subscribe(document.querySelector('[data-autocomplete-results="doctors"]'));
        this.#patientSearchResults.subscribe(document.querySelector('[data-autocomplete-results="patients"]'));

        //Filtra resultados cada vez que se escribe sobre el campo de texto (no necesita un botón para buscar)
        document.querySelector('[data-autocomplete="doctors"]').addEventListener('input', (e) => {
            //Cuando el tipo de evento calza con los descrito es porque
            //el valor no es a causa del usuario escribiendo, si no de seleccionar
            //una opción de la lista.
            //Explicación en https://stackoverflow.com/a/68087847
            if (!(e instanceof InputEvent) || e.inputType == 'insertReplacementText') {
                //Buscamos acorde al valor del campo de texto el item de la lista
                const doctor = this.#doctorSearchResults.value.find((item) => item.displayText == e.target.value);
                if(doctor != null) {
                    this.#appointment.doctorId.value = doctor.id;
                }

                //Después de utilizar el valor exacto para extraer o no una opción específica
                //removemos el número de índice del campo de texto
                e.target.value = e.target.value.substr(e.target.value.indexOf('.') + 2);
            } else {
                //El campo de texto es sólo un buscador, así que al usuario cambiar el valor
                //por medio de escribir de nuevo debe anular la opción anterior
                this.#appointment.doctorId.value = null;

                if(this.#searchTimeout != null) {
                    clearTimeout(this.#searchTimeout);
                }

                this.#searchTimeout = setTimeout(() => {
                    this.#searchTimeout = null;
                    this.#searchDoctors(e.target.value);
                }, 500);
            }
        });

        //Filtra resultados cada vez que se escribe sobre el campo de texto (no necesita un botón para buscar)
        document.querySelector('[data-autocomplete="patients"]').addEventListener('input', (e) => {
            //Cuando el tipo de evento calza con los descrito es porque
            //el valor no es a causa del usuario escribiendo, si no de seleccionar
            //una opción de la lista.
            //Explicación en https://stackoverflow.com/a/68087847
            if (!(e instanceof InputEvent) || e.inputType == 'insertReplacementText') {
                //Buscamos acorde al valor del campo de texto el item de la lista
                const patient = this.#patientSearchResults.value.find((item) => item.displayText == e.target.value);
                if(patient != null) {
                    this.#appointment.patientId.value = patient.id;
                }

                //Después de utilizar el valor exacto para extraer o no una opción específica
                //removemos el número de índice del campo de texto
                e.target.value = e.target.value.substr(e.target.value.indexOf('.') + 2);
            } else {
                //El campo de texto es sólo un buscador, así que al usuario cambiar el valor
                //por medio de escribir de nuevo debe anular la opción anterior
                this.#appointment.patientId.value = null;

                if(this.#searchTimeout != null) {
                    clearTimeout(this.#searchTimeout);
                }

                this.#searchTimeout = setTimeout(() => {
                    this.#searchTimeout = null;
                    this.#searchPatients(e.target.value);
                }, 500);
            }
        })
    }

    #save() {
        const data = {
            doctorId: this.#appointment.doctorId.value,
            patientId: this.#appointment.patientId.value,
            date: this.#appointment.date.value
        };

        if(this.#id == null) {
            AppointmentService.create(data, (result) => {
                if(result.success) {
                    this.#modal.close();
                    this.#searchAppointments();
                } else {
                    this.#formErrors.value = result.messages;
                }
            });
        } else {
            AppointmentService.update(this.#id, data, (result) => {
                if(result.success){
                    this.#modal.close();
                    this.#searchAppointments();
                } else {
                    this.#formErrors.value = result.messages;
                }
            });
        }
    }

    #searchDoctors(search) {
        //De un string completo separamos a una colección de filtros varios.
        //Cada item de la colección es la separación del string completo por cada espacio en blanco.
        //La función filter sólo incluye los valores de la colección original que no sean string vacío o nulo
        //La función trim elimina espacios en blanco a la derecha e izquiera para no ignorar multiples espacios en blanco
        const filters = search.split(' ').filter((filter) => filter.trim());

        DoctorService.search(filters, (result) => {
            //La función map de JavaScript recorre el array completo, aplicando a cada item el
            //callback que definimos y retornan un array con cada item modificado a lo que retorna
            //cada llamado del callback sobre dicho item
            this.#doctorSearchResults.value = result.data.map((item, i) => {
                //creamos una propiedad displayText para mostrar el valor formateado en la lista y
                //agregamos el índice de la iteración para asegurarnos que los valores sean
                //siempre únicos aunque haya resultados con nombre y apellido similar
                item.displayText = (i + 1) + '. ' + item.firstName + ' ' + item.lastName;
                return item;
            })
        });
    }

    #searchPatients(search) {
        //De un string completo separamos a una colección de filtros varios.
        //Cada item de la colección es la separación del string completo por cada espacio en blanco.
        //La función filter sólo incluye los valores de la colección original que no sean string vacío o nulo
        //La función trim elimina espacios en blanco a la derecha e izquiera para no ignorar multiples espacios en blanco
        const filters = search.split(' ').filter((filter) => filter.trim());

        PatientService.search(filters, (result) => {
            //La función map de JavaScript recorre el array completo, aplicando a cada item el
            //callback que definimos y retornan un array con cada item modificado a lo que retorna
            //cada llamado del callback sobre dicho item
            this.#patientSearchResults.value = result.data.map((item, i) => {
                //creamos una propiedad displayText para mostrar el valor formateado en la lista y
                //agregamos el índice de la iteración para asegurarnos que los valores sean
                //siempre únicos aunque haya resultados con nombre y apellido similar
                item.displayText = (i + 1) + '. ' + item.firstName + ' ' + item.lastName;
                return item;
            })
        });
    }

    #searchAppointments() {
        const filter = {
            dateFrom: this.#filter.dateFrom.value,
            dateTo: this.#filter.dateTo.value,
            doctor: {
                documentId: this.#filter.doctor.documentId.value,
                firstName: this.#filter.doctor.firstName.value,
                lastName: this.#filter.doctor.lastName.value,
                fieldId: this.#filter.doctor.field.value
            },
            patient: {
                documentId: this.#filter.patient.documentId.value,
                firstName: this.#filter.patient.firstName.value,
                lastName: this.#filter.patient.lastName.value,
                gender: this.#filter.patient.gender.value,
                birthDateFrom: this.#filter.patient.birthDateFrom.value,
                birthDateTo: this.#filter.patient.birthDateTo.value
            }
        };

        AppointmentService.list(filter, (result) => {
           this.#appointments.value = result.data;
        });
    }
}

let viewModel;
window.addEventListener('load', () => {
    viewModel = new ViewModel();
});