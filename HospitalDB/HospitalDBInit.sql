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
		CONSTRAINT PKField PRIMARY KEY (Id)
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
		CONSTRAINT PKDoctor PRIMARY KEY(Id),
		CONSTRAINT UXDoctorDocumentId UNIQUE(DocumentId),
		CONSTRAINT FKFieldDoctorFieldId FOREIGN KEY(FieldId) REFERENCES Field(Id)
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
		CONSTRAINT UXPatientDocumentId UNIQUE(DocumentId),
		CONSTRAINT PkPatient PRIMARY KEY (Id)
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
		CONSTRAINT PKAppointment PRIMARY KEY (Id),
		CONSTRAINT FKPatientAppointmentPatientId FOREIGN KEY(PatientId) REFERENCES Patient(Id),
		CONSTRAINT FKDoctorAppointmentDoctorId FOREIGN KEY(DoctorId) REFERENCES Doctor(Id)
	);

END

--INSERT FIELD DATA
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


