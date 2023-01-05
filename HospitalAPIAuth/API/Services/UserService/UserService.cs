using API.Data;
using API.Data.Filters;
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

        public IQueryable<User> ListUsers(UserListFilter? filter = null)
        {
            filter ??= new UserListFilter();

            return this._database
                    .User
                    .Where(u => (string.IsNullOrWhiteSpace(filter.Email) || u.Email.Contains(filter.Email))
                        && (string.IsNullOrWhiteSpace(filter.FirstName) || u.FirstName.Contains(filter.FirstName))
                        && (string.IsNullOrWhiteSpace(filter.LastName) || u.LastName.Contains(filter.LastName))
                        && (!filter.RoleId.HasValue || u.RoleId == filter.RoleId)
                        && !u.IsSuperAdmin);
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

        public async Task InsertUser(User entity)
        {
            this._database.User.Add(entity);
            await this._database.SaveChangesAsync();
            await this._database.Entry(entity).Reference(u => u.Role).LoadAsync();
        }

        public async Task UpdateUserInfo(User entity)
        {
            this._database.Entry(entity).Property(u => u.FirstName).IsModified = true;
            this._database.Entry(entity).Property(u => u.LastName).IsModified = true;
            await this._database.SaveChangesAsync();
        }

        public async Task UpdateUserEmail(User entity)
        {
            this._database.Attach(entity);
            this._database.Entry(entity).Property(u => u.Email).IsModified = true;
            await this.ExpireSessions(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task UpdateUserPassword(User entity)
        {
            this._database.Attach(entity);
            this._database.Entry(entity).Property(u => u.Password).IsModified = true;
            this._database.Entry(entity).Property(u => u.PasswordSalt).IsModified = true;
            await this.ExpireSessions(entity);
            await this._database.SaveChangesAsync();
        }

        public async Task DeleteUser(User entity)
        {
            List<Session> sessions = await this._database
                                            .Session
                                            .Where(s => s.UserId == entity.Id)
                                            .ToListAsync();

            foreach (Session session in sessions)
            {
                this._database.Remove(session);
            }

            this._database.User.Remove(entity);
            await this._database.SaveChangesAsync();;
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