using API.Data;
using API.Data.Models;
using API.Utils;
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
                await this.ExpireSessions(user);
            }

            this._database.Update(user);
            await this._database.SaveChangesAsync();
        }

        public async Task UpdateUserInfo(User user)
        {
            this._database.Entry(user).Property(u => u.FirstName).IsModified = true;
            this._database.Entry(user).Property(u => u.LastName).IsModified = true;
            await this._database.SaveChangesAsync();
        }

        public async Task UpdateUserEmail(User user)
        {
            this._database.Attach(user);
            this._database.Entry(user).Property(u => u.Email).IsModified = true;
            await this.ExpireSessions(user);
            await this._database.SaveChangesAsync();
        }

        public async Task UpdateUserPassword(User user)
        {
            this._database.Attach(user);
            this._database.Entry(user).Property(u => u.Password).IsModified = true;
            this._database.Entry(user).Property(u => u.PasswordSalt).IsModified = true;
            await this.ExpireSessions(user);
            await this._database.SaveChangesAsync();
        }

        private async Task ExpireSessions(User user)
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
    }
}