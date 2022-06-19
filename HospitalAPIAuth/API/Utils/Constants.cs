namespace API.Utils
{
    public static class Claims
    {
        public const string IssueDate = "issue_date";
        public const string User = "user";
        public const string Role = "role";
        public const string Session = "session";
        public const string SuperAdmin = "super_admin";
    }

    public static class RegularExpressions
    {
        public const string Email = @"^[\w-\.]+@([\w-]+\.)+[\w]+$";
        public const string Password = @"^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,}$";
    }

    public static class ResponseHeaders 
    { 
        public const string AccessTokenExpired = "access-token-expired";
        public const string SessionExpired = "session-expired";
    }
}
