using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class Service
    {
        private readonly DbContext _database;

        public Service(DbContext database)
        {
            this._database = database;
        }

        protected async Task<int> SaveRepositoriesAsync()
        {
            return await this._database.SaveChangesAsync();
        }
    }
}
