using API.Data;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService : Service, IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ISessionRepository _sessionRepository;

        public UserService(HospitalDB database, IUserRepository userRepository, ISessionRepository sessionRepository) : base(database)
        {
            this._userRepository = userRepository;
            this._sessionRepository = sessionRepository;
        }

        public async Task<User?> FindUser(int id)
        {
            return await this._userRepository
                                .Find(id)
                                .Include(u => u.Role)
                                .FirstOrDefaultAsync();
        }

        public async Task<User?> FindUser(string email)
        {
            return await this._userRepository.Query
                                .Include(u => u.Role)
                                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task UpdateUser(User user, bool expireSessions = false)
        {
            //Como acción opcional se pueden invalidar todas las sesiones de un usuario
            //como producto de un cambio significativo como cambio de contraseña o correo.
            if (expireSessions)
            {
                List<Session> sessions = await this._sessionRepository.Query.Where(s => s.UserId == user.Id).ToListAsync();
                foreach (Session session in sessions)
                {
                    session.DateExpiry = DateTime.Now;
                    this._sessionRepository.Update(session);
                }
            }

            this._userRepository.Update(user);
            await this.SaveRepositoriesAsync();
        }
    }
}
