using System.CommandLine;
using Crypter;

//Creamos el comando para que la consola pueda responder al mismo
//si el usuario ejecuta la aplicación por su nombre en la consola
//seguido del nombre del comando
Command hashCommand = HashCommand.CreateCommand();

RootCommand rootCommand = new RootCommand();
rootCommand.AddCommand(hashCommand);

/* Comentar esta línea para probar comandos específicos */
rootCommand.Invoke(args);

/* Descomentar esta línea para probar comando: hash */
//hashCommand.InvokeAsync(new string[] { "Test", "-i", "42" });