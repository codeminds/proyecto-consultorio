using API.Data;
using API.Data.Models;
using API.DataTransferObjects;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Services
{
    public class FieldService : IFieldService
    {
        private readonly HospitalDB _database;
        private readonly IMapper _mapper;

        public FieldService(HospitalDB database, IMapper mapper)
        {
            this._database = database;
            this._mapper = mapper;
        }

        public async Task<List<GetFieldDTO>> List()
        {
            return await this._database.Fields
                                           .Select(f => this._mapper.Map<Field, GetFieldDTO>(f))
                                           .ToListAsync();
        }
    }
}
