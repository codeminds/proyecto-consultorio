namespace API.DataTransferObjects
{
    public class GetAppointmentDTO
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public GetPatientDTO Patient { get; set; } = null!;
        public GetDoctorDTO Doctor { get; set; } = null!;
    }

    public class CreateUpdateAppointmentDTO
    {
        public DateTime? Date { get; set; }
        public int? PatientId { get; set; }
        public int? DoctorId { get; set; }
    }

    public class FilterAppointmentDTO
    { 
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }

        //Patient Filter
        public string? PatientDocumentId { get; set; }
        public string? PatientFirstName { set; get; }
        public string? PatientLastName { set; get; }
        public bool? PatientGender { set; get; }
        public DateTime? PatientBirthDateFrom { get; set; }
        public DateTime? PatientBirthDateTo { get; set; }

        //Doctor Filter
        public string? DoctorDocumentId { get; set; }
        public string? DoctorFirstName { get; set; }
        public string? DoctorLastName { get; set; }
        public int? DoctorFieldId { get; set; }
    }
}
