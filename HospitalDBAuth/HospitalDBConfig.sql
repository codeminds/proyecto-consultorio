USE HospitalDB;
GO

IF NOT EXISTS (SELECT * FROM [User] WHERE IsSuperAdmin = 1)
BEGIN
	DECLARE @AdminId INT;
	SELECT TOP 1 @AdminId = Id FROM Role WHERE Name = 'Administrador';
	INSERT INTO [User](Email, Password, PasswordSalt, FirstName, LastName, RoleId, IsSuperAdmin) 
		VALUES ('[EMAIl]', 
				0x[HEX_BYTES_PASSWORD],
				0x[HEX_BYTES_PASSWORD_SALT],
				'[SUPER]', '[ADMIN]', @AdminId,
				1);
END