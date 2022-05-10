using API.Data;
using API.Data.Filters;
using API.Data.Models;
using API.Repositories;
using API.Utils;
using Microsoft.EntityFrameworkCore;
using System.Net;
using System.Text;

namespace API.Services
{
    public class SessionService : ISessionService
    {
        private readonly HospitalDB _database;
        private readonly ISessionRepository _sessionRepository;

        public SessionService(HospitalDB database, ISessionRepository sessionRepository)
        {
            this._database = database;
            this._sessionRepository = sessionRepository;
        }

        public async Task<List<Session>> ListSessions(int userId, SessionListFilter filter)
        {
            return await this._sessionRepository.Query
                                        .Where(s => s.UserId == userId
                                                && (string.IsNullOrWhiteSpace(filter.AddressIssued) || s.AddressIssued.Contains(filter.AddressIssued))
                                                && (string.IsNullOrWhiteSpace(filter.AddressRefreshed) || s.AddressRefreshed!.Contains(filter.AddressRefreshed))
                                                && (!filter.DateFrom.HasValue || s.DateIssued >= filter.DateFrom)
                                                && (!filter.DateTo.HasValue || s.DateExpiry <= filter.DateTo))
                                        .ToListAsync();
        }

        public async Task<Session?> FindSession(Guid sessionId)
        {
            return await this._sessionRepository.Query
                                    .Include(s => s.User)
                                    .Include(s => s.User.Role)
                                    .FirstOrDefaultAsync(s => s.SessionId == sessionId);
        }

        public async Task<Session> CreateUserSession(User user, IPAddress? address)
        {
            DateTime now = DateTime.Now;
            Guid sessionId = Guid.NewGuid();
            string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
            string refreshToken = Token.IssueRefreshToken(user, sessionId);

            Session session = new Session
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

            this._sessionRepository.Insert(session);
            await this._database.SaveChangesAsync();

            return session;
        }

        public async Task RefreshUserSession(User user, Session session, IPAddress? address)
        {
            DateTime now = DateTime.Now;
            string salt = Configuration.Get<string>("Authentication:RefreshTokenSalt");
            string refreshToken = Token.IssueRefreshToken(session.User, session.SessionId);

            session.DateRefreshed = now;
            session.AddressRefreshed = address?.ToString() ?? "--";
            session.DateExpiry = now.AddDays(30);
            session.RefreshToken = Crypter.Hash(refreshToken, Encoding.UTF8.GetBytes(salt));
            session.RefreshTokenString = refreshToken;
            session.AccessTokenString = Token.IssueAccessToken(user, session.SessionId);

            this._sessionRepository.Update(session);
            await this._database.SaveChangesAsync();
        }

        public async Task DeleteSession(Session session)
        {
            this._sessionRepository.Delete(session);
            await this._database.SaveChangesAsync();
        }
    }
}
