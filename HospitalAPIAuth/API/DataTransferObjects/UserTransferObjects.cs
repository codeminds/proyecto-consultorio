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

    public class UpdateUserDTO
    { 
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class UpdateUserEmailDTO
    {
        public string? Email { get; set; }
    }

    public class UpdateUserPasswordDTO
    {
        public string? Password { get; set; }
    }
}
