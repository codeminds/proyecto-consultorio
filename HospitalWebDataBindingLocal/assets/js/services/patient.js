import { createGuid, patientTestData } from "../test-data.js";

export class PatientService {
    static get(id, callback){
        const result = patientTestData.find((item) => {
            return item.id == id; 
        })

        callback(result);
    }
    
    static list(filter, callback) {
        const result = []; 
        
        for(const patient of patientTestData) {
            let add = true;

            add = !filter.documentId || patient.documentId.toLowerCase().includes(filter.documentId.toLowerCase());
            add = add && (!filter.firstName || patient.firstName.toLowerCase().includes(filter.firstName.toLowerCase()));
            add = add && (!filter.lastName || patient.lastName.toLowerCase().includes(filter.lastName.toLowerCase()));
            add = add && (filter.gender == null || patient.gender == filter.gender);
            add = add && (!filter.birthDateFrom || patient.birthDate >= filter.birthDateFrom);
            add = add && (!filter.birthDateTo || patient.birthDate <= filter.birthDateTo);

            if(add) {
                result.push(patient);
            }
        }

        callback(result);
    }

    //Función de búsqueda que no distingue valores fijos para cada campo de filtro, si no en vez
    //utiliza una lista de strings para comparar valores con todos los que desea buscar
    static search(filters, callback) {
        const result = []; 
        
        //A diferencia de la función de lista, en vez de mostrar todos los resultados si no hay
        //ningún filtro, esta función no busca sin filtros.
        if(filters.length > 0) {
            for(const patient of patientTestData) {
                let add = false;
    
                //Filtros de búsqueda pueden cambiar add a true para averiguar si va dentro de los
                //resultados o no
                for(const filter of filters) {
                    add = add || patient.documentId.toLowerCase().includes(filter.toLowerCase());
                    add = add || patient.firstName.toLowerCase().includes(filter.toLowerCase());
                    add = add || patient.lastName.toLowerCase().includes(filter.toLowerCase());
                }

                //En search el filtro no es aditivo. Cualquier filtro true al comparar
                //causa que se agregue a los resultados
                if(add) {
                    result.push(patient);
                }
            }
        }

        //Función pasada por parámetro hará lo que desee con lista de resultados
        callback(result);
    }

    static create(data, callback) {
        data.id = createGuid();
        patientTestData.push(data);
        callback(data);
    }

    static update(id, data, callback) {
        PatientService.get(id, (patient) => {
            if(patient != null) {
                patient.documentId = data.documentId;
                patient.firstName = data.firstName;
                patient.lastName = data.lastName;
                patient.gender = data.gender;
                patient.birthDate = data.birthDate; 

                callback(patient)

            } else {
                    callback(null);              
            }
        });
    }

    static delete(id, callback) { 
        const index = patientTestData.findIndex((item) => {
            return item.id == id;
        });

        if(index >= 0) {
            patientTestData.splice(index, 1);
            callback(true);
        } else {
            callback(false);
        }
    }
}
