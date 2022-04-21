namespace API.Attributes
{
    //Al crear una clase que hereda de Attribue puede ser utilizado como uno
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute
    {
        public string[] Roles { get; private set; }

        public AuthorizeAttribute(params string[] roles)
        {
            this.Roles = roles;
        }
    }
}
