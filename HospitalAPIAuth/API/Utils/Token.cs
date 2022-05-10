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
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(Claims.IssueDate, DateTimeOffset.Now.ToUnixTimeSeconds().ToString()));
            claims.Add(new Claim(Claims.User, user.Id.ToString(), ClaimValueTypes.Integer));
            claims.Add(new Claim(Claims.Session, session.ToString(), ClaimValueTypes.String));
            claims.Add(new Claim(Claims.Role, user.Role.Name, ClaimValueTypes.String));
            claims.Add(new Claim(Claims.SuperAdmin, user.IsSuperAdmin.ToString(), ClaimValueTypes.Boolean));

            //Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            //un intento de forjado sería sumamente poco probable
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.Get<string>("JWT:Secret")));
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: Configuration.Get<string>("JWT:Issuer"),
                audience: Configuration.Get<string>("JWT:Audience"),
                expires: DateTime.UtcNow.AddMinutes(Configuration.Get<int>("JWT:Access:ExpirationMinutes")),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string IssueRefreshToken(User user, Guid session)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(Claims.IssueDate, DateTimeOffset.Now.ToUnixTimeSeconds().ToString()));
            claims.Add(new Claim(Claims.User, user.Id.ToString(), ClaimValueTypes.Integer));
            claims.Add(new Claim(Claims.Session, session.ToString(), ClaimValueTypes.String));

            //Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            //un intento de forjado sería sumamente poco probable
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.Get<string>("JWT:Secret")));
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: Configuration.Get<string>("JWT:Issuer"),
                audience: Configuration.Get<string>("JWT:Audience"),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static List<Claim> GetValidTokenClaims(string jwtToken, bool validateExpiration)
        {
            //Antes de utilizar la información del token que estamos recibiendo, se valida su firma,
            //además de otros parámetros para confirmar que este fue gestionado por un ente válido
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.Get<string>("JWT:Secret")));
            TokenValidationParameters validation = new TokenValidationParameters 
            {
                ValidateIssuer = true,
                ValidIssuer = Configuration.Get<string>("JWT:Issuer"),
                ValidateAudience = true,
                ValidAudience = Configuration.Get<string>("JWT:Audience"),
                RequireExpirationTime = false,
                RequireSignedTokens = true,
                IssuerSigningKey = key,
            };

            if (validateExpiration)
            { 
                validation.ValidateLifetime = true;
                validation.RequireExpirationTime = true;
                validation.ClockSkew = TimeSpan.FromMinutes(Configuration.Get<int>("JWT:ClockStewMinutes"));
            }

            //Si la validación falla por alguna razón, dependiendo de esta, la función ValidateToken
            //lanza una de varias posibles excepciones
            ClaimsPrincipal claims = new JwtSecurityTokenHandler().ValidateToken(jwtToken, validation, out _);

            return claims.Claims.ToList();
        }

        public static List<Claim> GetTokenClaims(string jwtToken)
        {
            JwtSecurityToken token = new JwtSecurityTokenHandler().ReadJwtToken(jwtToken);

            return token.Claims.ToList();
        }
    }
}
