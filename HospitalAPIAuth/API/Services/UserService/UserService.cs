﻿using API.Data;
using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly HospitalDB _database;
        private readonly IUserRepository _userRepository;
        private readonly ISessionRepository _sessionRepository;

        public UserService(HospitalDB database, IUserRepository userRepository, ISessionRepository sessionRepository)
        {
            this._database = database;
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
            await this._database.SaveChangesAsync();
        }
    }
}
