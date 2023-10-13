using API.Utils;

namespace API.Attributes
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute
    {
        public UserRole[] Roles { get; }

        public AuthorizeAttribute(params UserRole[] roles)
        {
            this.Roles = roles;
        }
    }
}