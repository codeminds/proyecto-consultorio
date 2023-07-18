using API.Data.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Utils
{
    public static class Token
    {
        public static string IssueAccessToken(User user, Guid session)
        { 
            /* La lista de información personalizada de un token se conoce como "Claims"
            lo cual es una colección de afirmaciones que tiene el token sobre alguien
            que lo tiene, como una tarjeta de acceso digital */
            List<Claim> claims = new()
            { 
                new Claim(Claims.IssueDate, DateTimeOffset.Now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim(Claims.UserId, user.Id.ToString(), ClaimValueTypes.Integer),
                new Claim(Claims.User, user.Email, ClaimValueTypes.String),
                new Claim(Claims.Session, session.ToString(), ClaimValueTypes.String),
                new Claim(Claims.RoleId, user.RoleId.ToString(), ClaimValueTypes.Integer),
                new Claim(Claims.Role, user.Role.Name, ClaimValueTypes.String),
                new Claim(Claims.SuperAdmin, user.IsSuperAdmin.ToString(), ClaimValueTypes.Boolean)
            };

            /* Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            un intento de forjado sería sumamente poco probable */
            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(Configuration.Get<string>("JWT:Secret")));
            JwtSecurityToken token = new(
                issuer: Configuration.Get<string>("JWT:Issuer"),
                audience: Configuration.Get<string>("JWT:Audience"),
                expires: DateTime.UtcNow.AddMinutes(Configuration.Get<int>("JWT:AccessExpirationMinutes")),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string IssueRefreshToken(User user, Guid session)
        {
            /* La lista de información personalizada de un token se conoce como "Claims"
            lo cual es una colección de afirmaciones que tiene el token sobre alguien
            que lo tiene, como una tarjeta de acceso digital */
            List<Claim> claims = new()
            {
                new Claim(Claims.IssueDate, DateTimeOffset.Now.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64),
                new Claim(Claims.UserId, user.Id.ToString(), ClaimValueTypes.Integer),
                new Claim(Claims.User, user.Email, ClaimValueTypes.String),
                new Claim(Claims.Session, session.ToString(), ClaimValueTypes.String),
            };

            /* Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            un intento de forjado sería sumamente poco probable */
            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(Configuration.Get<string>("JWT:Secret")));
            JwtSecurityToken token = new(
                issuer: Configuration.Get<string>("JWT:Issuer"),
                audience: Configuration.Get<string>("JWT:Audience"),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static List<Claim> GetValidTokenClaims(string jwtToken, bool validateExpiration)
        { 
            /* Antes de utilizar la información del token que estamos recibiendo, se valida su firma,
            además de otros parámetros para confirmar que este fue gestionado por un ente válido */
            SymmetricSecurityKey key = new(Encoding.UTF8.GetBytes(Configuration.Get<string>("JWT:Secret")));
            TokenValidationParameters validation = new()
            { 
                ValidateIssuer = true,
                ValidIssuer = Configuration.Get<string>("JWT:Issuer"),
                ValidateAudience = true,
                ValidAudience = Configuration.Get<string>("JWT:Audience"),
                RequireExpirationTime = validateExpiration,
                ValidateLifetime = validateExpiration,
                RequireSignedTokens = true,
                IssuerSigningKey = key
            };

            if(validateExpiration)
            {
                validation.ClockSkew = TimeSpan.FromMinutes(Configuration.Get<int>("JWT:ClockSkewMinutes"));
            }

            /* Si la validación falla por alguna razón, dependiendo de esta, la función ValidateToken
            lanza una de varias posibles excepciones */
            ClaimsPrincipal claims = new JwtSecurityTokenHandler().ValidateToken(jwtToken, validation, out _);

            return claims.Claims.ToList();
        }
    }
}
