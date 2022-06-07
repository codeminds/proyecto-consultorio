using System.CommandLine;
using System.CommandLine.NamingConventionBinder;
using System.Security.Cryptography;
using System.Text;

namespace Crypter
{
    internal static class HashCommand
    {
        public static Command CreateCommand()
        {
            //Parámetro opcional --salt
            Option saltOption = new Option<string>("--salt", "El valor para utilizar como sal de hashing")
            {
                IsRequired = false,
            };

            //Agregamos alias para poder definir el valor de este parámetro con --salt y -s
            saltOption.AddAlias("-s");
            //Al ser opcional debemos proporcionar un valor por defecto en caso de no ser especificado
            saltOption.SetDefaultValue("Salt");


            //Parámetro opcional --iterations
            Option iterationsOption = new Option<int>("--iterations", "La cantidad de iteraciones de hashing a realizar")
            {
                IsRequired = false,
            };

            //Agregamos alias para poder definir el valor de este parámetro con --iterations y -i
            iterationsOption.AddAlias("-i");
            //Al ser opcional debemos proporcionar un valor por defecto en caso de no ser especificado
            iterationsOption.SetDefaultValue(1000);


            //Parámetro opcional --bytes
            Option bytesOption = new Option<int>("--bytes", "La cantidad de bytes del hash resultante")
            {
                IsRequired = false,
            };

            //Agregamos alias para poder definir el valor de este parámetro con --bytes y -b
            bytesOption.AddAlias("-b");
            //Al ser opcional debemos proporcionar un valor por defecto en caso de no ser especificado
            bytesOption.SetDefaultValue(64);

            //Argumento input. Un argumento a diferencia de los parámetros no tiene nombre, en vez se proporciona
            //un valor justo después del nombre del comando y este será el valor asociado con cada argumento
            //por orden respectivo
            Argument inputArgument = new Argument<string>("input", "El valor base para crear el hash");

            //Comando hash. Por medio de este comando especificamos la acción que queremos ejecutar
            Command hashCommand = new Command("hash")
            {
                Description = "Crea un hash a partir de la función criptográfica PBKDF2 con el algoritmo SHA512"
            };

            //Se agregan los argumentos y parámetros opcionales al comando para asociarlos
            hashCommand.AddArgument(inputArgument);
            hashCommand.AddOption(saltOption);
            hashCommand.AddOption(iterationsOption);
            hashCommand.AddOption(bytesOption);

            //La propiedad handler contiene un lambda que especifica el funcionamiento resultante de llamar al comando.
            //Los parámetros del lambda deben llamarse igual a los nombres que se le dieron a cada argumento y parámetro del comando
            hashCommand.Handler = CommandHandler.Create<string, string, int, int>((input, salt, iterations, bytes) =>
            {
                //Encriptación acorde a parámetros proporcionados
                Rfc2898DeriveBytes hash = new Rfc2898DeriveBytes(input,
                                                            Encoding.UTF8.GetBytes(salt),
                                                            iterations,
                                                            HashAlgorithmName.SHA512);

                //Impresión de resultado
                Console.WriteLine("Información de Hash");
                Console.WriteLine("===================");
                Console.WriteLine("Función Criptográfica: PBKDF2");
                Console.WriteLine("Función Hashing: SHA512");
                Console.WriteLine($"Sal: {salt}");
                Console.WriteLine($"Iteraciones: {iterations}");
                Console.WriteLine($"Tamaño: {bytes} Bytes");
                Console.WriteLine();
                Console.WriteLine("Salida de Hash");
                Console.WriteLine("==============");
                Console.WriteLine($"Hex: {Convert.ToHexString(hash.GetBytes(bytes))}");
                Console.WriteLine($"Base64: {Convert.ToBase64String(hash.GetBytes(bytes))}");
            });

            //Retornamos la definición del comando creado para utilizar en el programa principal
            return hashCommand;
        }
    }
}
