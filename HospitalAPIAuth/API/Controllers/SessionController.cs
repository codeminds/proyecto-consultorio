﻿using API.Attributes;
using API.Data.Filters;
using API.Data.Models;
using API.DataTransferObjects;
using API.Services;
using API.Utils;
using API.Validators;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Primitives;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;

namespace API.Controllers
{
    [Route("api/sessions")]
    [ApiController]
    public class SessionController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ISessionService _sessionService;
        private readonly IUserService _userService;
        private readonly ISessionValidator _sessionValidator;

        public SessionController(IMapper mapper, ISessionService sessionService, IUserService userService, ISessionValidator sessionValidator)
        {
            this._mapper = mapper;
            this._userService = userService;
            this._sessionService = sessionService;
            this._sessionValidator = sessionValidator;
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<APIResponse>> ListSessions([FromQuery] FilterSessionDTO data)
        {
            SessionFilters filter = this._mapper.Map<FilterSessionDTO, SessionFilters>(data);
            List<Session> list = await this._sessionService
                                        .ListSessions(Convert.ToInt32(HttpContext.Items[Claims.User]), filter)
                                        .ToListAsync();

            APIResponse response = new()
            {
                Data = list.Select(p => this._mapper.Map<Session, GetSessionDTO>(p))
            };

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<APIResponse>> LogIn(LoginSessionDTO data)
        {
            APIResponse response = new();
            response.Success = this._sessionValidator.ValidateLogin(data, response.Messages);

            if (response.Success)
            {
                //Al estar el password encriptado y utilizando un password salt aleatorio a la hora
                //de la creación del usuario necesitamos volver a encriptar con el mismo salt la
                //contraseña proporcionada en el login, de esta manera sabemos si es igual a la del usuario registrado
                User? user = await this._userService.FindUser(data.Email!);
                if (user == null || Convert.ToHexString(Crypter.Hash(data.Password!, user.PasswordSalt)) != Convert.ToHexString(user.Password))
                {
                    return HttpErrors.NotFound("Usuario y contraseña incorrectos");
                }

                Session session = await this._sessionService.InitUserSession(user, Request.HttpContext.Connection.RemoteIpAddress);
                response.Data = this._mapper.Map<Session, GetSessionTokensDTO>(session);
            }

            return response;
        }

        [HttpPatch]
        public async Task<ActionResult<APIResponse>> RefreshSession()
        {
            try
            {
                if (!Request.Headers.TryGetValue("Session", out StringValues tokenHeader))
                {
                    return HttpErrors.BadRequest(data: "Encabezado de sesión no está presente");
                }

                //Los tokens siempre tienen el prefijo "Bearer" para marcar que tipo de token se está enviando
                //como estándar de la industria. Por lo que un token (e.g.: Bearer 2hfkskwjshfdhussa1312...) debe ser
                //extraído sin la palabra "Bearer" o la validación del mismo fallará. Al estar el valor total del token
                //separado de dicha palabra por un espacio, creamos un array the strings separando el string por espacios
                //en blanco, resultando un array de 2 items (e.g.: ["Bearer", "2hfkskwjshfdhussa1312..."])
                string token = tokenHeader.ToString().Split(" ")[1];
                List<Claim> claims = Token.GetValidTokenClaims(token, false);
                Guid sessionId = Guid.Parse(claims.First(c => c.Type == Claims.Session).Value);

                //Los tokens de refrescado de cada sesión se guardan en ellas como un hash con salt específico
                //este debe ser utilizado para comparar el token enviado para refrescar la sesión, validando
                //que no sea un token obsoleto que fue utilizado anteriormente
                string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
                byte[] tokenHash = Crypter.Hash(token, Encoding.UTF8.GetBytes(salt));

                Session? session = await this._sessionService.FindSession(sessionId);
                if (session == null || Convert.ToHexString(session.RefreshToken) != Convert.ToHexString(tokenHash))
                {
                    return HttpErrors.Unauthorized("Su sesión ha expirado", "Token de refrescado no válido o reutilizado");
                }

                if (session.DateExpiry <= DateTime.Now)
                {
                    //Una serie de peticiones al mismo tiempo pueden causar que se intente borrar una sesión
                    //repetidas veces, lo cuál genera problemas con EntityFramework. En este caso específico
                    //atrapamos la excepción y seguimos adelante sin problema
                    try
                    { 
                        await this._sessionService.DeleteSession(session);
                    }
                    catch (DbUpdateConcurrencyException)
                    { 
                        //Log informativo
                    }
                    
                    Response.Headers.Add(ResponseHeaders.SessionExpired, "true");
                    return HttpErrors.Unauthorized("Su sesión ha expirado");
                }

                await this._sessionService.RefreshUserSession(session.User, session, Request.HttpContext.Connection.RemoteIpAddress);

                APIResponse response = new()
                {
                    Data = this._mapper.Map<Session, GetSessionTokensDTO>(session)
                };

                return response;
            }
            catch (SecurityTokenException)
            {
                return HttpErrors.BadRequest(data: "Token de refrescado no válido");
            }
        }

        [HttpDelete]
        [Route("{sessionId?}")]
        [Authorize]
        public async Task<ActionResult<APIResponse>> LogOut(Guid? sessionId = null)
        {
            //La función permite eliminar la sesión que estamos utilizando u otras sesiones por medio de su id,
            //por esta razón debemos validar que la sesión que se intenta eliminar no sea de otro usuario
            Session? session = await this._sessionService.FindSession(sessionId ?? Guid.Parse(Convert.ToString(HttpContext.Items[Claims.Session])!));
            if (session == null || session.UserId != Convert.ToInt32(HttpContext.Items[Claims.User]))
            {
                return HttpErrors.NotFound("Sesión no existe en el sistema");
            }

            await this._sessionService.DeleteSession(session);

            APIResponse response = new()
            {
                Data = this._mapper.Map<Session, GetSessionDTO>(session),
                Messages = new(){ "Sesión ha sido eliminada" }
            };

            return response;
        }
    }
}