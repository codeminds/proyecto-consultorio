namespace API.Data.Filters
{
    public class SessionListFilter
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? AddressIssued { get; set; }
        public string? AddressRefreshed { get; set; }
    }
}
