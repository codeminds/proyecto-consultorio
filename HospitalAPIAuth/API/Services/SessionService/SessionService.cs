using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class SessionService : ISessionService
    {
        private readonly HospitalDB _database;

        public SessionService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<List<Session>> List(int userId)
        {
            return await this._database.Session
                                        .Where(s => s.UserId == userId)
                                        .ToListAsync();
        }

        public async Task<Session?> Get(Guid sessionId)
        {
            return await this._database.Session
                                    .FirstOrDefaultAsync(s => s.SessionId == sessionId);
        }

        public async Task<long> Insert(Session entity)
        {
            this._database.Session.Add(entity);
            await this._database.SaveChangesAsync();

            return entity.Id;
        }

        public async Task Update(Session entity)
        {
            this._database.Session.Update(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task Delete(Session entity)
        {
            this._database.Session.Remove(entity);
            await this._database.SaveChangesAsync();
        }
    }
}
