using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly HospitalDB _database;

        public UserService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<User?> FindUser(int id)
        {
            return await this._database
                            .User
                            .Include(u => u.Role)
                            .Where(p => p.Id == id)
                            .FirstOrDefaultAsync();
        }

        public async Task<User?> FindUser(string email)
        {
            return await this._database
                            .User
                            .Include(u => u.Role)
                            .Where(u => u.Email == email)
                            .FirstOrDefaultAsync();
        }

        public async Task UpdateUser(User user, bool expireSessions = false)
        {
            //Como acción opcional se pueden invalidar todas las sesiones de un usuario
            //como producto de un cambio significativo como cambio de contraseña o correo.
            if (expireSessions)
            {
                List<Session> sessions = await this._database
                                                .Session
                                                .Where(s => s.UserId == user.Id)
                                                .ToListAsync();

                foreach (Session session in sessions)
                {
                    session.DateExpiry = DateTime.Now;
                    this._database.Update(session);
                }
            }

            this._database.Update(user);
            await this._database.SaveChangesAsync();
        }
    }
}