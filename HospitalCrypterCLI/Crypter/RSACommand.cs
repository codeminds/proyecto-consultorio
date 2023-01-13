using System.CommandLine;
using System.CommandLine.NamingConventionBinder;
using System.CommandLine.Parsing;
using System.ComponentModel;
using System.Data.SqlTypes;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace Crypter
{
    internal static class RSACommand
    {
        private enum Format
        {
            hex = 1,
            base64
        }

        public static Command CreateCommand()
        { 
            //Parámetro opcional --format
            Option formatOption = new Option<Format?>("--format", "El formato de texto de los valores entrantes y salientes de las operaciones a realizar")
            {
                IsRequired = false,
            };

            //Agregamos alias para poder definir el valor de este parámetro con --fomat y -f
            formatOption.AddAlias("-f"); 
            //Al ser opcional debemos proporcionar un valor por defecto en caso de no ser especificado
            formatOption.SetDefaultValue(Format.hex);

            //Parámetro opcional --keys
            Option keysOption = new Option<int?>("--keys", "Al proporcionarse alterna el funcionamiento del comando para en vez crear una pareja de llaves el tamaño en bytes proporcionado")
            {
                IsRequired = false,
            };

            //Agregamos alias para poder definir el valor de este parámetro con --keys y -k
            keysOption.AddAlias("-k"); 
            //Al ser opcional debemos proporcionar un valor por defecto en caso de no ser especificado
            keysOption.SetDefaultValue(1024);
            //Validador personalizado que cambia el valor por defecto a nulo si la opción no es utilizada
            keysOption.AddValidator(result => { 
                if(result.Token is null)
                {
                    keysOption.SetDefaultValue(null);
                }
            });

            //Parámetro opcional --decrypt
            Option decryptOption = new Option<bool>("--decrypt", "Desencripta el valor proporcionado en ver de encriptarlo")
            { 
                IsRequired = false
            };

            //Agregamos alias para poder definir el valor de este parámetro con --decrypt y -d
            decryptOption.AddAlias("-d");
            //Al ser opcional debemos proporcionar un valor por defecto en caso de no ser especificado
            decryptOption.SetDefaultValue(false);

            //Argumento input. Un argumento a diferencia de los parámetros no tiene nombre, en vez se proporciona
            //un valor justo después del nombre del comando y este será el valor asociado con cada argumento
            //por orden respectivo
            Argument inputArgument = new Argument<string>("input", "El valor a encriptar o desencriptar");
            inputArgument.SetDefaultValue("");

            //Argumento key.
            Argument keyArgument = new Argument<string>("key", "La llave para encriptar o desencriptar");
            keyArgument.SetDefaultValue("");

            //Comando rsa. Por medio de este comando especificamos la acción que queremos ejecutar
            Command rsaCommand = new("rsa")
            {
                Description = "Encripta o desencripta un valor por medio del algoritmo RSA y un par de llaves proporcionadas"
            };

            
            rsaCommand.AddOption(formatOption);
            rsaCommand.AddOption(keysOption);
            rsaCommand.AddOption(decryptOption);
            rsaCommand.AddArgument(inputArgument);
            rsaCommand.AddArgument(keyArgument);
            
            rsaCommand.Handler = CommandHandler.Create<Format?, int?, bool, string, string>((format, keys, decrypt, input, key) => {
                //Al enviar a crear un par de llaves de encriptación los demás valores en el comando
                //serán ignorados ya que sólo se usan a la hora de encriptar o desencriptar.
                if(keys.HasValue)
                { 
                    Console.ForegroundColor = ConsoleColor.Yellow;
                    Console.WriteLine();
                    Console.WriteLine("ALERTA: Creando llaves de RSA. Todos los demás parámetros del comando serán ignorados...");
                    Console.ResetColor();

                    using (RSA rsa = RSA.Create(keys.Value))
                    {
                        string publicKey = string.Empty;
                        string privateKey = string.Empty;

                        switch(format)
                        {
                            case Format.hex:
                                publicKey = Convert.ToHexString(rsa.ExportRSAPublicKey());
                                privateKey = Convert.ToHexString(rsa.ExportRSAPrivateKey());
                                break;
                            case Format.base64:
                                publicKey = Convert.ToBase64String(rsa.ExportRSAPublicKey());
                                privateKey = Convert.ToBase64String(rsa.ExportRSAPrivateKey());
                                break;
                        } 

                        Console.WriteLine();
                        Console.WriteLine("Información Criptográfica");
                        Console.WriteLine("=========================");
                        Console.WriteLine("Función Criptográfica: RSA");
                        Console.WriteLine($"Formato: {format}");
                        Console.WriteLine($"Bytes: {keys}");

                        Console.WriteLine();
                        Console.WriteLine("Llaves");
                        Console.WriteLine("=========================");
                        Console.WriteLine($"Pública: {publicKey}");
                        Console.WriteLine();
                        Console.WriteLine($"Privada: {privateKey}");   
                    }

                    return;
                }

                using(RSA rsa = RSA.Create())
                { 
                    byte[] keyBytes = new byte[0];

                    try
                    {
                        switch(format)
                        {
                            case Format.hex:
                                    keyBytes = Convert.FromHexString(key);
                                    break;
                            case Format.base64:
                                    keyBytes = Convert.FromBase64String(key);
                                    break;
                        }
                    }
                    catch (FormatException)
                    {
                        Console.ForegroundColor = ConsoleColor.Red;
                        Console.WriteLine();
                        Console.WriteLine($"ERROR: Llave no está en formato {format} válido");
                        Console.ResetColor();
                        return;
                    }

                    Console.WriteLine();
                    Console.WriteLine("Información Criptográfica");
                    Console.WriteLine("=========================");
                    Console.WriteLine("Función Criptográfica: RSA");
                    Console.WriteLine($"Formato: {format}");
                    Console.WriteLine("Padding: OaepSHA256");
                    
                    if(decrypt)
                    {    
                        byte[] valueBytes = new byte[0];

                        try
                        {
                            switch(format)
                            {
                                case Format.hex:
                                        valueBytes = Convert.FromHexString(input);
                                        break;
                                case Format.base64:
                                        valueBytes = Convert.FromBase64String(input);
                                        break;
                            }
                        }
                        catch (FormatException)
                        {
                            Console.ForegroundColor = ConsoleColor.Red;
                            Console.WriteLine();
                            Console.WriteLine($"ERROR: Valor no está en formato {format} válido");
                            Console.ResetColor();
                            return;
                        }

                        rsa.ImportRSAPrivateKey(keyBytes, out _);
                        byte[] decryptedBytes = rsa.Decrypt(valueBytes, RSAEncryptionPadding.OaepSHA256); 

                        Console.WriteLine();
                        Console.WriteLine("Desencriptación");
                        Console.WriteLine("=========================");
                        Console.WriteLine($"Valor: {Encoding.UTF8.GetString(decryptedBytes)}");
                    }
                    else
                    { 
                        byte[] valueBytes = Encoding.UTF8.GetBytes(input);

                        rsa.ImportRSAPublicKey(keyBytes, out _);
                        byte[] encryptedBytes = rsa.Encrypt(valueBytes, RSAEncryptionPadding.OaepSHA256);

                        string encrypted = string.Empty;

                        switch(format)
                        {
                            case Format.hex:
                                encrypted = Convert.ToHexString(encryptedBytes);
                                break;
                            case Format.base64:
                                encrypted = Convert.ToBase64String(encryptedBytes);
                                break;
                        }

                        Console.WriteLine();
                        Console.WriteLine("Encriptación");
                        Console.WriteLine("=========================");
                        Console.WriteLine($"Valor: {encrypted}");
                    }
                }
            });

            return rsaCommand;
        }
    }
}
