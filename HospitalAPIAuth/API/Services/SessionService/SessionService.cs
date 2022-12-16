using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Utils;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text;

namespace API.Services
{
    public class SessionService : ISessionService
    {
        private readonly HospitalDB _database;

        public SessionService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Session> ListSessions(int userId, SessionListFilter filter)
        {
            return this._database
                    .Session
                    .Where(s => s.UserId == userId
                        && (string.IsNullOrWhiteSpace(filter.AddressIssued) || s.AddressIssued.Contains(filter.AddressIssued))
                        && (string.IsNullOrWhiteSpace(filter.AddressRefreshed) || s.AddressRefreshed!.Contains(filter.AddressRefreshed))
                        && (!filter.DateFrom.HasValue || s.DateIssued >= filter.DateFrom)
                        && (!filter.DateTo.HasValue || s.DateExpiry <= filter.DateTo));
        }

        public async Task<Session?> FindSession(Guid sessionId)
        {
            return await this._database
                            .Session
                            .Include(s => s.User)
                            .Include(s => s.User.Role)
                            .FirstOrDefaultAsync(s => s.SessionId == sessionId);
        }

        public async Task<Session> InitUserSession(User user, IPAddress? address)
        {
            DateTime now = DateTime.Now;
            Guid sessionId = Guid.NewGuid();
            string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
            string refreshToken = Token.IssueRefreshToken(user, sessionId);

            //El token de refrescado se guarda en la base de datos como un
            //hash para evitar que el valor sea directamente visible en la
            //base de datos
            Session session = new()
            {
                SessionId = sessionId,
                UserId = user.Id,
                DateIssued = now,
                AddressIssued = address?.ToString() ?? "--",
                DateExpiry = now.AddDays(Configuration.Get<int>("Authentication:SessionDays")),
                RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt)),
                RefreshTokenString = refreshToken,
                AccessTokenString = Token.IssueAccessToken(user, sessionId)
            };

            this._database.Add(session);
            await this._database.SaveChangesAsync();

            return session;
        }

        public async Task RefreshUserSession(User user, Session session, IPAddress? address)
        {
            //Al refrescar la sesión el token utilizado debe ser descartado
            //ya que sólo debe utilizarse una vez por seguridad, por lo que
            //se debe crear un nuevo token de refrescado y asociarlo a la sesión
            //que se está refrescando
            DateTime now = DateTime.Now;
            string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
            string refreshToken = Token.IssueRefreshToken(user, session.SessionId);

            session.DateRefreshed = now;
            session.AddressRefreshed = address?.ToString() ?? "--";
            session.DateExpiry = now.AddDays(30);
            session.RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt));
            session.RefreshTokenString = refreshToken;
            session.AccessTokenString = Token.IssueAccessToken(user, session.SessionId);

            this._database.Update(session);
            await this._database.SaveChangesAsync();
        }

        public async Task DeleteSession(Session session)
        {
            this._database.Session.Remove(session);
            await this._database.SaveChangesAsync();;
        }
    }
}