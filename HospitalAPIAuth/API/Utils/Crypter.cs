using System.Security.Cryptography;

namespace API.Utils
{
    public static class Crypter
    {
        public static byte[] Hash(string input, byte[] salt, int byteLength = 64)
        {
            Rfc2898DeriveBytes hash = new Rfc2898DeriveBytes(input,
                                                salt,
                                                Configuration.Get<int>("Cryptography:HashingIterations"), 
                                                HashAlgorithmName.SHA512);
            return hash.GetBytes(byteLength);
        }
    }
}
