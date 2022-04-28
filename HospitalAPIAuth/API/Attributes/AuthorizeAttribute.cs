﻿using API.Utils;

namespace API.Attributes
{
    //Al crear una clase que hereda de Attribue puede ser utilizado como uno
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
