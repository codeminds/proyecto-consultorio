//Se debe agregar este export vacío para que se considere un módulo
//ya que "declare global" sólo puede existir en módulos
export {}

//Declaramos un interfaz nueva que ayuda a sobreescribir el prototipo
//del objeto String de JavaScript para incluir nuestro método de extensión a la instancia
declare global {
    interface String {
        capitalize(): string;
    }
}

String.prototype.capitalize = function() {
    return `${this.charAt(0).toUpperCase()}${this.substring(1, this.length)}`;
}