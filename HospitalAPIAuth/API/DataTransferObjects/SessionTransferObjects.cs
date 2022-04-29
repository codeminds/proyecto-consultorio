namespace API.DataTransferObjects
{
    public class GetSessionDTO
    {
        public Guid SessionId { get; set; }
        public DateTime Date { get; set; }
        public DateTime Expiration { get; set; }
    }
}
