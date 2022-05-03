namespace API.DataTransferObjects
{
    public class GetSessionDTO
    {
        public Guid SessionId { get; set; }
        public DateTime DateIssued { get; set; }
        public DateTime? DateRefreshed { get; set; }
        public DateTime DateExpiry { get; set; }
        public string AddressIssued { get; set; } = null!;
        public string? AddressRefreshed { get; set; }
    }

    public class GetSessionTokensDTO
    {
        public string AccessToken { get; set; } = null!;
        public string RefreshToken { get; set; } = null!;
    }

    public class LoginSessionDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class FilterSessionDTO
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? AddressIssued { get; set; }
        public string? AddressRefreshed { get; set; }
    }
}
