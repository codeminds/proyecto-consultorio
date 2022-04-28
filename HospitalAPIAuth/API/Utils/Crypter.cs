using System.Security.Cryptography;

namespace API.Utils
{
    public static class Crypter
    {
        public static byte[] Hash(string input, byte[] salt, IConfiguration configuration)
        {
            Rfc2898DeriveBytes hash = new Rfc2898DeriveBytes(input, 
                                                salt, 
                                                configuration.GetSection("Cryptography:HashingIterations").Get<int>(), 
                                                HashAlgorithmName.SHA512);
            return hash.GetBytes(64);
        }
    }
}
