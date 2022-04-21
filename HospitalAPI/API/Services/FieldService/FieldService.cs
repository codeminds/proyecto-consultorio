using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class FieldService : IFieldService
    {
        private readonly HospitalDB _database;

        public FieldService(HospitalDB database)
        {
            this._database = database;
        }

        public async Task<List<Field>> List()
        {
            return await this._database.Field.ToListAsync();
        }
    }
}
