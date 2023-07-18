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

        public IQueryable<Session> ListSessions(int userId, SessionFilters? filter = null)
        {
            filter ??= new SessionFilters();

            return this._database.Session
                    .Include(s => s.User)
                    .Include(s => s.User.Role)
                    .Where(s => s.UserId == userId
                        && (string.IsNullOrEmpty(filter.AddressIssued) || s.AddressIssued.Contains(filter.AddressIssued))
                        && (string.IsNullOrEmpty(filter.AddressRefreshed) || s.AddressRefreshed!.Contains(filter.AddressRefreshed))
                        && (!filter.DateFrom.HasValue || s.DateIssued >= filter.DateFrom)
                        && (!filter.DateTo.HasValue || s.DateIssued <= filter.DateTo));
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

            Session session = new()
            { 
                SessionId = sessionId,
                UserId = user.Id,
                DateIssued = now,
                AddressIssued = address?.ToString() ?? "--",
                DateExpiry = now.AddDays(Configuration.Get<int>("Authentication:SessionDays")),
                RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt), Configuration.Get<int>("Cryptography:SaltLength")),
                RefreshTokenString = refreshToken,
                AccessTokenString = Token.IssueAccessToken(user, sessionId)
            };

            this._database.Add(session);
            await this._database.SaveChangesAsync();

            return session;
        }

        public async Task RefreshUserSession(User user, Session session, IPAddress? address)
        {
            DateTime now = DateTime.Now;
            string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
            string refreshToken = Token.IssueRefreshToken(user, session.SessionId);

            session.DateRefreshed = now;
            session.AddressRefreshed = address?.ToString() ?? "--";
            session.DateExpiry = now.AddDays(Configuration.Get<int>("Authentication:SessionDays"));
            session.RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt), Configuration.Get<int>("Cryptography:SaltLength"));
            session.RefreshTokenString = refreshToken;
            session.AccessTokenString = Token.IssueAccessToken(user, session.SessionId);

            this._database.Update(session);
            await this._database.SaveChangesAsync();  
        }

        public async Task DeleteSession(Session entity)
        {
            this._database.Session.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
