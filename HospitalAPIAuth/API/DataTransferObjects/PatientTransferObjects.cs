namespace API.DataTransferObjects
{
    public class GetPatientDTO
    {
        public int Id { get; set; }
        public string DocumentId { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;        
        public DateTime BirthDate{ get; set; }
        public GetGenderDTO Gender { get; set; } = null!;
    }

    public class InsertUpdatePatientDTO
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; } 
        public string? LastName { set; get; }
        public DateTime? BirthDate { get; set; }
        public int? GenderId { set; get; }
    }

    public class FilterPatientDTO
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; }
        public string? LastName { set; get; }
        public DateTime? BirthDateFrom { get; set; }
        public DateTime? BirthDateTo { get; set; }
        public int? GenderId { set; get; }
    }
}
