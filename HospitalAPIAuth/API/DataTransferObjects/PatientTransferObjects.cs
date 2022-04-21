namespace API.DataTransferObjects
{
    public class GetPatientDTO
    {
        public int Id { get; set; }
        public string DocumentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Gender { get; set; }
        public DateTime BirthDate{ get; set; }
    }

    public class CreateUpdatePatientDTO
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; } 
        public string? LastName { set; get; }
        public bool? Gender { set; get; }
        public DateTime? BirthDate { get; set; }
    }

    public class FilterPatientDTO
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; }
        public string? LastName { set; get; }
        public bool? Gender { set; get; }
        public DateTime? BirthDateFrom { get; set; }
        public DateTime? BirthDateTo { get; set; }
    }
}
