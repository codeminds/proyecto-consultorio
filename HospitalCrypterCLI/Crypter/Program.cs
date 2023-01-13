using System.CommandLine;
using Crypter;



RootCommand rootCommand = new RootCommand();

//Creamos los comandos para que la consola pueda responder al mismo
//si el usuario ejecuta la aplicación por su nombre en la consola
//seguido del nombre del comando
rootCommand.AddCommand(HashCommand.CreateCommand());
rootCommand.AddCommand(RSACommand.CreateCommand());

/* Comentar esta línea para probar comandos específicos */
rootCommand.Invoke(args);

/* Descomentar esta línea para probar comando: hash */
//hashCommand.InvokeAsync(new string[] { "Test", "-i", "42" });