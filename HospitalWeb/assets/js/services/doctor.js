import { createGuid, doctorTestData } from "../test-data.js";
import { FieldService } from "./field.js";

export class DoctorService {
    static get(id, callback) {
        //Encuentra doctor por medio de su id o devuelve null
        const result = doctorTestData.find((item) => {
            return item.id == id;
        })

        //Función pasada por parámetro hará lo que desee con resultado encontrado o vacío
        callback(result);
    }
    
    static list(filter, callback) {
        const result = []; 
        
        for(const doctor of doctorTestData) {
            let add = true;

            //Filtros de búsqueda pueden cambiar add a false para averiguar si va dentro de los
            //resultados o no
            add = !filter.documentId || doctor.documentId.toLowerCase().includes(filter.documentId.toLowerCase());
            add = add && (!filter.firstName || doctor.firstName.toLowerCase().includes(filter.firstName.toLowerCase()));
            add = add && (!filter.lastName || doctor.lastName.toLowerCase().includes(filter.lastName.toLowerCase()));
            add = add && (!filter.fieldId || doctor.fieldId == filter.fieldId);

            //Si luego de todos los filtros add se mantiene con valor "true" se agrega item
            //a resultados
            if(add) {
                result.push(doctor);
            }
        }

        //Función pasada por parámetro hará lo que desee con lista de resultados
        callback(result);
    }

    //Función de búsqueda que no distingue valores fijos para cada campo de filtro, si no en vez
    //utiliza una lista de strings para comparar valores con todos los que desea buscar
    static search(filters, callback) {
        const result = []; 
        
        //A diferencia de la función de lista, en vez de mostrar todos los resultados si no hay
        //ningún filtro, esta función no busca sin filtros.
        if(filters.length > 0) {
            for(const doctor of doctorTestData) {
                let add = false;
    
                //Filtros de búsqueda pueden cambiar add a true para averiguar si va dentro de los
                //resultados o no
                for(const filter of filters) {
                    add = add || doctor.documentId.toLowerCase().includes(filter.toLowerCase());
                    add = add || doctor.firstName.toLowerCase().includes(filter.toLowerCase());
                    add = add || doctor.lastName.toLowerCase().includes(filter.toLowerCase());
                    add = add || doctor.field.toLowerCase().includes(filter.toLowerCase());
                }

                
                //En search el filtro no es aditivo. Cualquier filtro true al comparar
                //causa que se agregue a los resultados
                if(add) {
                    result.push(doctor);
                }
            }
        }

        //Función pasada por parámetro hará lo que desee con lista de resultados
        callback(result);
    }

    static create(data, callback) {
        data.id = createGuid();
        FieldService.get(data.fieldId, (field) => {
            if(field != null) {
                data.fieldId = field.id;
                data.field = field.name;
                doctorTestData.push(data);

                //Función pasada por parámetro hará lo que desee con objeto de nuevo doctor creado
                callback(data);
            } else {
                //Si especialización es null se mandó un id que no existe,
                //cancelando el intento de insertar el nuevo doctor. 
                //función pasada por parámetro hará lo que desee con 
                //un resultado vacío indicando que nada se insertó
                callback(null);
            }
        });
    }

    static update(id, data, callback) {
        //Utiliza parámetro id para llamar a función get
        //para saber si existe o no el id a actualizar
        DoctorService.get(id, (doctor) => {
            if(doctor != null) {
                //Utiliza servicio de especializaciones para
                //buscar si id de especialización en datos de actualización
                //existe
                FieldService.get(data.fieldId, (field) => {
                    if(field != null) {
                        doctor.fieldId = field.id;
                        doctor.field = field.name;
                    } else {
                        //Si especialización es null se mandó un id que no existe,
                        //cancelando el intento de actualizar el doctor. 
                        //función pasada por parámetro hará lo que desee con 
                        //un resultado vacío indicando que nada se actualizó
                        callback(null);
                    }
                });

                doctor.documentId = data.documentId;
                doctor.firstName = data.firstName;
                doctor.lastName = data.lastName;

                //Función pasada por parámetro hará lo que desee con objeto de doctor con datos actualizados
                callback(doctor);
            } else {
                //Si doctor es null se mandó un id que no existe y 
                //función pasada por parámetro hará lo que desee con 
                //un resultado vacío indicando que nada se actualizó
                callback(null);
            }
        });
    }

    static delete(id, callback) { 
        //Encuentra doctor por medio de su id y devuelve el índice en la colección
        //o -1 si no logró encontrar ningún doctor con dicho id
        const index = doctorTestData.findIndex((item) => {
            return item.id == id;
        });

        //Si doctor existe, utiliza su índice para borrarse a él mismo de la colección
        //Función pasa por parámetro recibe "true" si se logra borrar o "false" si no pudo encontrar
        //un récord qué borrar
        if(index >= 0) {
            doctorTestData.splice(index, 1);
            callback(true);
        } else {
            callback(false);
        }
    }
}
