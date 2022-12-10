namespace API.Data.Filters
{
    public class PatientListFilter
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; }
        public string? LastName { set; get; }
        public int? GenderId { set; get; }
        public DateTime? BirthDateFrom { get; set; }
        public DateTime? BirthDateTo { get; set; }
    }
}
