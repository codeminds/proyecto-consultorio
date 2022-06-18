//Se debe agregar este export vacío para que se considere un módulo
//ya que "declare global" sólo puede existir en módulos
export {}

//Declaramos un interfaz nueva que ayuda a sobreescribir el constructor
//del objeto Date de JavaScript para incluir nuestro método de extensión estático
declare global {
    interface DateConstructor {
        isDate(value: any) : boolean;
    }
}

//Declaramos un interfaz nueva que ayuda a sobreescribir el prototipo
//del objeto Date de JavaScript para incluir nuestro método de extensión a la instancia
declare global {
    interface Date {
        toInputDateString(withTime?: boolean): string;
        toLocaleDisplayString(locale: string): string;
    }
}

//Se agrega el método al prototipo para que sea parte de la instancia de nuevos objetos Date
Date.prototype.toInputDateString = function (withTime: boolean = true): string {
    let dateString = `${this.getFullYear()}-${pad((this.getMonth() + 1), 2)}-${pad(this.getDate(), 2)}`;

    if(withTime) {
      dateString += `T${pad(this.getHours(), 2)}:${pad(this.getMinutes(), 2)}:${pad(this.getSeconds(), 2)}.${this.getMilliseconds()}`;
    }

    return dateString;
}

Date.prototype.toLocaleDisplayString = function (locale: string): string {
    return this.toLocaleString(locale, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: true });
}

//Se agrega el método directo al constructor del objeto Date para ser usado de manera estática
Date.isDate = (value: any): boolean => {
    return !isNaN(new Date(value).getTime());
}

function pad(num: number, size: number): string {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}