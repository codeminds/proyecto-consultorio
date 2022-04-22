IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HospitalDB')
BEGIN
	CREATE DATABASE HospitalDB;
END
GO

USE HospitalDB;
GO

-- CREATE FIELD
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE Name = 'Field' AND xtype = 'U')
BEGIN
	CREATE TABLE Field(
		Id INT NOT NULL IDENTITY(1, 1),
		Name NVARCHAR(50) NOT NULL,
		CONSTRAINT PKField PRIMARY KEY CLUSTERED (Id)
	);
END
GO

-- CREATE DOCTOR
IF NOT EXISTS(SELECT * FROM sys.sysobjects WHERE Name = 'Doctor' AND xtype = 'U')
BEGIN
	CREATE TABLE Doctor(
		Id INT NOT NULL IDENTITY(1, 1),
		DocumentId VARCHAR(9) NOT NULL,
		FirstName NVARCHAR(50) NOT NULL,
		LastName NVARCHAR(50) NOT NULL,
		FieldId INT NOT NULL,
		CONSTRAINT PKDoctor PRIMARY KEY CLUSTERED (Id),
		CONSTRAINT UXDoctorDocumentId UNIQUE NONCLUSTERED (DocumentId),
		CONSTRAINT FKFieldDoctorFieldId FOREIGN KEY(FieldId) REFERENCES Field(Id),
		INDEX IXDoctorLookup NONCLUSTERED (DocumentId, FirstName, LastName, FieldId)
	);
END

-- CREATE PATIENT
IF NOT EXISTS(SELECT * FROM sys.sysobjects WHERE Name = 'Patient' AND xtype = 'U')
BEGIN
	CREATE TABLE Patient(
		Id INT NOT NULL IDENTITY(1, 1),
		DocumentId VARCHAR(9) NOT NULL,
		FirstName NVARCHAR(50) NOT NULL,
		LastName NVARCHAR(50) NOT NULL,
		BirthDate DATETIME2(7) NOT NULL,
		Gender BIT NOT NULL,
		CONSTRAINT PkPatient PRIMARY KEY CLUSTERED (Id),
		CONSTRAINT UXPatientDocumentId UNIQUE NONCLUSTERED (DocumentId),
		INDEX IXPatientLookup NONCLUSTERED (DocumentId, FirstName, LastName, BirthDate, Gender)
	);
END

-- CREATE APPOINTMENT
IF NOT EXISTS(SELECT * FROM sys.sysobjects WHERE Name = 'Appointment' AND xtype = 'U')
BEGIN
	CREATE TABLE Appointment(
		Id INT NOT NULL IDENTITY(1, 1),
		Date DATETIME2(7) NOT NULL,
		DoctorId INT NOT NULL,
		PatientId INT NOT NULL,
		CONSTRAINT PKAppointment PRIMARY KEY CLUSTERED (Id),
		CONSTRAINT FKPatientAppointmentPatientId FOREIGN KEY (PatientId) REFERENCES Patient(Id),
		CONSTRAINT FKDoctorAppointmentDoctorId FOREIGN KEY (DoctorId) REFERENCES Doctor(Id),
		INDEX IXAppointmentLookup NONCLUSTERED (Date, DoctorId, PatientId)
	);
END

-- CREATE ROLE
IF NOT EXISTS(SELECT * FROM sys.sysobjects WHERE Name = 'Role' AND xtype = 'U')
BEGIN
	CREATE TABLE Role(
		Id INT NOT NULL,
		Name NVARCHAR(50) NOT NULL,
		CONSTRAINT PKRole PRIMARY KEY CLUSTERED (Id),
	);
END

-- CREATE USER
IF NOT EXISTS(SELECT * FROM sys.sysobjects WHERE Name = 'User' AND xtype = 'U')
BEGIN
	CREATE TABLE [User](
		Id INT NOT NULL IDENTITY(1, 1),
		Email VARCHAR(100) NOT NULL,
		Password BINARY(64) NOT NULL,
		PasswordSalt BINARY(64) NOT NULL,
		FirstName NVARCHAR(50) NOT NULL,
		LastName NVARCHAR(50) NOT NULL,
		RoleId INT NOT NULL,
		IsSuperAdmin BIT NOT NULL CONSTRAINT DFUserIsSuperAdmin DEFAULT 0,
		CONSTRAINT PKUser PRIMARY KEY CLUSTERED (Id),
		CONSTRAINT UXUserEmail UNIQUE NONCLUSTERED (Email),
		CONSTRAINT FKRoleUserRoleId FOREIGN KEY(RoleId) REFERENCES Role(Id),
		INDEX IXUserLookup NONCLUSTERED (Email, FirstName, LastName, RoleId)
	);
END

-- CREATE SESSION
IF NOT EXISTS(SELECT * FROM sys.sysobjects WHERE Name = 'Session' AND xtype = 'U')
BEGIN
	CREATE TABLE Session(
		Id BIGINT NOT NULL IDENTITY(1,1),
		SessionId UNIQUEIDENTIFIER NOT NULL CONSTRAINT DFSessionSessionID DEFAULT NEWID(),
		UserId INT NOT NULL,
		Date DATETIME2(7) NOT NULL,
		Expiration DATETIME2(7) NOT NULL,
		RefreshToken BINARY(32) NOT NULL,
		CONSTRAINT PKSession PRIMARY KEY CLUSTERED (Id),
		CONSTRAINT UXSessionSessionId UNIQUE NONCLUSTERED (SessionId),
		CONSTRAINT FKUserSessionUserId FOREIGN KEY (UserId) REFERENCES [User](Id),
	);
END

-- INSERT FIELD DATA
IF NOT EXISTS(SELECT * FROM Field WHERE Name = 'Doctor General')
BEGIN
	INSERT INTO Field (Name) VALUES ('Doctor General');
END

IF NOT EXISTS(SELECT * FROM Field WHERE Name = 'Dentista')
BEGIN
	INSERT INTO Field (Name) VALUES ('Dentista');
END

IF NOT EXISTS(SELECT * FROM Field WHERE Name = 'Pediatra')
BEGIN
	INSERT INTO Field (Name) VALUES ('Pediatra');
END

IF NOT EXISTS(SELECT * FROM Field WHERE Name = 'Cirujano')
BEGIN
	INSERT INTO Field (Name) VALUES ('Cirujano');
END

-- INSERT ROLE DATA
IF NOT EXISTS(SELECT * FROM Role WHERE Name = 'Administrador')
BEGIN
	INSERT INTO Role (Id, Name) VALUES (1, 'Administrador');
END

IF NOT EXISTS(SELECT * FROM Role WHERE Name = 'Editor')
BEGIN
	INSERT INTO Role (Id, Name) VALUES (2, 'Editor');
END

IF NOT EXISTS(SELECT * FROM Role WHERE Name = 'Asistente')
BEGIN
	INSERT INTO Role (Id, Name) VALUES (3, 'Asistente');
END
