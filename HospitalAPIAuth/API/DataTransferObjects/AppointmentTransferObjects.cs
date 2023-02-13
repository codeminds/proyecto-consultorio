namespace API.DataTransferObjects
{
   public class GetAppointmentDTO
   {
      public int Id { get; set; }
      public DateTime Date { get; set; }
      public GetPatientDTO Patient { get; set; } = null!;
      public GetDoctorDTO Doctor { get; set; } = null!;
   }

   public class InsertUpdateAppointmentDTO
   {
      public DateTime? Date { get; set; }
      public int? PatientId { get; set; }
      public int? DoctorId { get; set; }
   }

   public class FilterAppointmentDTO
   {
      public DateTime? DateFrom { get; set; }
      public DateTime? DateTo { get; set; }
      public FilterDoctorDTO? Doctor { get; set; }
      public FilterPatientDTO? Patient { get; set; }
   }
}
