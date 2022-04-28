using API.Data.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace API.Utils
{
    public static class Token
    {
        public static string IssueToken(List<Claim> claims, IConfiguration configuration, DateTime? expiry = null)
        {
            //Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            //un intento de forjado sería sumamente poco probable
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JWT:Secret").Get<string>()));
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: configuration.GetSection("JWT:Issuer").Get<string>(),
                audience: configuration.GetSection("JWT:Audience").Get<string>(),
                expires: expiry,
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string IssueAccessToken(User user, IConfiguration configuration)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(Claims.User, user.Email));
            claims.Add(new Claim(Claims.Role, user.RoleId.ToString(), ClaimValueTypes.Integer));
            claims.Add(new Claim(Claims.SuperAdmin, user.IsSuperAdmin.ToString(), ClaimValueTypes.Boolean));

            //Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            //un intento de forjado sería sumamente poco probable
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JWT:Secret").Get<string>()));
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: configuration.GetSection("JWT:Issuer").Get<string>(),
                audience: configuration.GetSection("JWT:Audience").Get<string>(),
                expires: DateTime.UtcNow.AddMinutes(configuration.GetSection("JWT:Access:ExpirationMinutes").Get<int>()),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static string IssueRefreshToken(User user, Guid session, IConfiguration configuration)
        {
            List<Claim> claims = new List<Claim>();
            claims.Add(new Claim(Claims.User, user.Email));
            claims.Add(new Claim(Claims.Session, session.ToString()));

            //Se define una llave secreta en la cuál sólo tenemos acceso desde el API, de esta manera
            //un intento de forjado sería sumamente poco probable
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JWT:Secret").Get<string>()));
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: configuration.GetSection("JWT:Issuer").Get<string>(),
                audience: configuration.GetSection("JWT:Audience").Get<string>(),
                claims: claims,
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public static List<Claim> GetValidTokenClaims(string jwtToken, IConfiguration configuration, bool validateExpiration)
        {
            //Antes de utilizar la información del token que estamos recibiendo, se valida su firma,
            //además de otros parámetros para confirmar que este fue gestionado por un ente válido
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration.GetSection("JWT:Secret").Get<string>()));
            TokenValidationParameters validation = new TokenValidationParameters 
            {
                ValidateIssuer = true,
                ValidIssuer = configuration.GetSection("JWT:Issuer").Get<string>(),
                ValidateAudience = true,
                ValidAudience = configuration.GetSection("JWT:Audience").Get<string>(),
                RequireSignedTokens = true,
                IssuerSigningKey = key,
            };

            if (validateExpiration)
            { 
                validation.ValidateLifetime = true;
                validation.RequireExpirationTime = true;
                validation.ClockSkew = TimeSpan.FromMinutes(configuration.GetSection("JWT:ClockStewMinutes").Get<int>());
            }

            //Si la validación falla por alguna razón, dependiendo de esta, la función ValidateToken
            //lanza una de varias posibles excepciones
            ClaimsPrincipal claims = new JwtSecurityTokenHandler().ValidateToken(jwtToken, validation, out _);

            return claims.Claims.ToList();
        }
    }
}
