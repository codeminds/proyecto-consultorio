using API.Data;
using API.Data.Models;

namespace API.Services
{
    public class StatusService : IStatusService
    {
        private readonly HospitalDB _database;

        public StatusService(HospitalDB database)
        {
            this._database = database;
        }

        public IQueryable<Status> ListStatusses()
        {
            return this._database
                    .Status;
        }
    }
}
