namespace API.Data.Filters
{
    public class SessionFilters
    {
        public string? AddressIssued { get; set; }
        public string? AddressRefreshed { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
    }
}
