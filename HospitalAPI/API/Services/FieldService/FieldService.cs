using API.Data;
using API.Data.Models;
using API.Repositories;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace API.Services
{
    public class FieldService : IFieldService
    {
        private readonly HospitalDB _database;
        private readonly IMapper _mapper;
        private readonly IFieldRepository _fieldRepository;

        public FieldService(HospitalDB database, IMapper mapper, IFieldRepository fieldRepository)
        {
            this._database = database;
            this._mapper = mapper;
            this._fieldRepository = fieldRepository;
        }

        public async Task<List<Field>> ListFields()
        {
            return await this._fieldRepository
                                    .Query()
                                    .ToListAsync();
        }
    }
}
