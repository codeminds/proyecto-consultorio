namespace API.Data.Filters
{
    public class PatientListFilter
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; }
        public string? LastName { set; get; }
        public string? Tel { get; set; }
        public string? Email { get; set; }
    }
}
