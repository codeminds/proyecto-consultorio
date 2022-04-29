namespace API.DataTransferObjects
{
    public class GetSessionDTO
    {
        public Guid SessionId { get; set; }
        public DateTime Date { get; set; }
        public DateTime Expiration { get; set; }
    }

    public class GetSessionTokensDTO
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class LoginSessionDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class RefreshSessionDTO
    {
        public string RefreshToken { get; set; }
    }
}
