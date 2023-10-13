using System.Security.Cryptography;

namespace API.Utils
{
    public static class Crypter
    {
        public static byte[] Hash(string input, byte[] salt, int byteLength)
        {
            Rfc2898DeriveBytes hash = new(input,
                                            salt,
                                            Configuration.Get<int>("Cryptography:HashingIterations"),
                                            HashAlgorithmName.SHA512);

            return hash.GetBytes(byteLength);
        }

        public static byte[] GetRandomSalt(int length)
        {
            return RandomNumberGenerator.GetBytes(length);
        }
    }
}