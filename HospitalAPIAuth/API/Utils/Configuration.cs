﻿namespace API.Utils
{
    public static class Configuration
    {
        public static IConfiguration? Settings { private get; set; }

        public static T Get<T>(string section)
        {
            if (Settings == null)
            {
                throw new NullReferenceException("Property Settings must be configured.");
            }

            return Settings.GetSection(section).Get<T>();
        }
    }
}