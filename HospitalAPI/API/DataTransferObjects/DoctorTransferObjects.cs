namespace API.DataTransferObjects
{
    public class GetDoctorDTO
    {
        public int Id { get; set; }
        public string Code { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public GetFieldDTO Field { get; set; } = null!;
    }

    public class InsertUpdateDoctorDTO
    {
        public string? Code { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? FieldId { get; set; }
    }

    public class FilterDoctorDTO
    {
        public string? Code { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? FieldId { get; set; }
    }
}
