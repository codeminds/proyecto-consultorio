using API.Data.Models;
using API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class FieldService : IFieldService
    {
        private readonly IFieldRepository _fieldRepository;

        public FieldService(IFieldRepository fieldRepository)
        {
            this._fieldRepository = fieldRepository;
        }

        public async Task<List<Field>> ListFields()
        {
            return await this._fieldRepository
                                    .Query
                                    .ToListAsync();
        }
    }
}
