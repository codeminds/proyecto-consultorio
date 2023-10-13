namespace API.DataTransferObjects
{
    public class GetPatientDTO
    {
        public int Id { get; set; }
        public string DocumentId { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Tel { get; set; } = null!;
        public string Email { get; set; } = null!;
    }

    public class InsertUpdatePatientDTO
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; }
        public string? LastName { set; get; }
        public string? Tel { get; set; }
        public string? Email { get; set; }
    }

    public class FilterPatientDTO
    {
        public string? DocumentId { get; set; }
        public string? FirstName { set; get; }
        public string? LastName { set; get; }
        public string? Tel { get; set; }
        public string? Email { get; set; }
    }
}
