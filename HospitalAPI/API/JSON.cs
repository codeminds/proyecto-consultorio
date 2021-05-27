using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace API
{
    public static class JSON
    {
        public static string Serialize(object data)
        {
            return JsonConvert.SerializeObject(data, new JsonSerializerSettings()
            {
                ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
            });
        }
    }
}
