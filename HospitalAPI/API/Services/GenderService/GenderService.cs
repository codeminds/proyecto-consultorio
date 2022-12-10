using API.Data;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class GenderService : IGenderService
    {
        private readonly HospitalDB _database;

        public GenderService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Gender> ListGenders()
        {
            return this._database
                    .Gender;
        }
    }
}
