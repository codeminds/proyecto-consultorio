namespace API.DataTransferObjects
{
    public class GetUserDTO
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public GetRoleDTO Role { get; set; }
        public bool IsSuperAdmin { get; set; }
    }

    public class GetUserTokensDTO 
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }

    public class LoginUserDTO
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class UpdateUserDTO
    { 
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
    }

    public class UpdateUserPasswordDTO
    {
        public string? Password { get; set; }
    }

    public class FilterUserDTO
    { 
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public int? RoleId { get; set; }
    }
}
