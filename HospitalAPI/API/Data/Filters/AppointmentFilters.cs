namespace API.Data.Filters
{
    public class AppointmentListFilter
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? StatusId { get; set; }
        public DoctorListFilter? Doctor { get; set; }
        public PatientListFilter? Patient { get; set; }
    }
}
