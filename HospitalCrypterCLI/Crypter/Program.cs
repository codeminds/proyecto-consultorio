using System.CommandLine;
using System.CommandLine.NamingConventionBinder;

Option iterationsOption = new Option<int>("--iterations", "La cantidad de iteraciones de hashing a realizar") 
{
    IsRequired = false,
};

iterationsOption.AddAlias("-i");
iterationsOption.SetDefaultValue(1000);

Option bytesOption = new Option<int>("--bytes", "La cantidad de bytes del hash resultante")
{
    IsRequired = false,
};

bytesOption.AddAlias("-b");
bytesOption.SetDefaultValue(64);

Option saltOption = new Option<int>("--salt", "La cantidad de bytes del salt para las iteraciones de hashing")
{
    IsRequired = false,
};

saltOption.AddAlias("-s");
saltOption.SetDefaultValue(64);

Argument hashArgument = new Argument<string>("hash", "El valor base para crear el hash");

Command hashCommand = new Command("hash") 
{
    Description = "Crea un hash"
};

hashCommand.AddArgument(hashArgument);
hashCommand.AddOption(iterationsOption);
hashCommand.AddOption(bytesOption);
hashCommand.AddOption(saltOption);

hashCommand.Handler = CommandHandler.Create<string, int, int, int>((hash, iterations, bytes, salt) =>
{
    Console.WriteLine(hash);
    Console.WriteLine(iterations);
    Console.WriteLine(bytes);
    Console.WriteLine(salt);
});

/* Descomentar para probar comando: hash */
//hashCommand.InvokeAsync(new string[] { "Test", "-i", "42" });