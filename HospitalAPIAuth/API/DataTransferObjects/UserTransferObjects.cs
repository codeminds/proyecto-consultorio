namespace API.DataTransferObjects
{
    public class GetUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public GetRoleDTO Role { get; set; } = null!;
        public bool IsSuperAdmin { get; set; }
    }

    public class UpdateSelfUserDTO
    {
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? NewPassword { get; set; }
    }

    public class InsertUpdateUserDTO
    {
        public int? Id { get; set; }
        public string? Email { get; set; } = null!;
        public string? FirstName { get; set; } = null!;
        public string? LastName { get; set; } = null!;
        public int? RoleId { get; set; }
        public string? NewPassword { get; set; }
    }

    public class FilterUserDTO
    {
        public string? Email { get; set; } = null!;
        public string? FirstName { get; set; } = null!;
        public string? LastName { get; set; } = null!;
        public int? RoleId { get; set; }
    }
}