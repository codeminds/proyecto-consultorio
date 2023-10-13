namespace API.Data.Filters
{
    public class UserListFilter
    {
        public string? Email { get; set; } = null!;
        public string? FirstName { get; set; } = null!;
        public string? LastName { get; set; } = null!;
        public int? RoleId { get; set; }
    }
}