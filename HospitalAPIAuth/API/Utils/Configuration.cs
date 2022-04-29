namespace API.Utils
{
    public static class Configuration
    {
        public static IConfiguration Settings { private get; set; }

        public static T Get<T>(string section)
        {
            return Settings.GetSection(section).Get<T>();
        }
    }
}
