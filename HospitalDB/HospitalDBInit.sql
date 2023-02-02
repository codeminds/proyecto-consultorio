IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'HospitalDB')
BEGIN
	CREATE DATABASE HospitalDB;
END
GO

USE HospitalDB;
GO

-- CREATE FIELD
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE name = 'Field' and xtype = 'U')
BEGIN
	CREATE TABLE Field (
		Id INT NOT NULL IDENTITY(1,1),
		Name VARCHAR(50) NOT NULL,
		CONSTRAINT PKField PRIMARY KEY (Id)
	)
END
GO

-- CREATE DOCTOR
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE name = 'Doctor' and xtype = 'U')
BEGIN
	CREATE TABLE Doctor (
		Id INT NOT NULL IDENTITY(1,1),
		DocumentId VARCHAR(9) NOT NULL,
		FirstName VARCHAR(50) NOT NULL,
		LastName VARCHAR(50) NOT NULL,
		FieldId INT NOT NULL,
		CONSTRAINT PKDoctor PRIMARY KEY (Id),
		CONSTRAINT UXDoctorDocumentId UNIQUE (DocumentId),
		CONSTRAINT FKFieldDoctorFieldId FOREIGN KEY (FieldId) REFERENCES Field (Id)
	)
END
GO

-- CREATE GENDER
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE name = 'Gender' and xtype = 'U')
BEGIN
	CREATE TABLE Gender (
		Id INT NOT NULL IDENTITY(1,1),
		Name VARCHAR(50) NOT NULL,
		CONSTRAINT PKGender PRIMARY KEY (Id)
	)
END
GO

-- CREATE PATIENT
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE name = 'Patient' and xtype = 'U')
BEGIN
	CREATE TABLE Patient (
		Id INT NOT NULL IDENTITY(1,1),
		DocumentId VARCHAR(9) NOT NULL,
		FirstName VARCHAR(50) NOT NULL,
		LastName VARCHAR(50) NOT NULL,
		BirthDate DATETIME2(7) NOT NULL,
		GenderId INT NOT NULL
		CONSTRAINT PKPatient PRIMARY KEY (Id),
		CONSTRAINT UXPatientDocumentId UNIQUE (DocumentId),
		CONSTRAINT FKGenderPatientGenderId FOREIGN KEY (GenderId) REFERENCES Gender (Id)
	)
END
GO

-- CREATE APPOINTMENT
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE name = 'Appointment' and xtype = 'U')
BEGIN
	CREATE TABLE Appointment (
		Id INT NOT NULL IDENTITY(1,1),
		Date DATETIME2(7) NOT NULL,
		PatientId INT NOT NULL,
		DoctorId INT NOT NULL,
		CONSTRAINT PKAppointment PRIMARY KEY (Id),
		CONSTRAINT FKPatientAppointmentPatientId FOREIGN KEY (PatientId) REFERENCES Patient (Id),
		CONSTRAINT FKDoctorAppointmentDoctorId FOREIGN KEY (DoctorId) REFERENCES Doctor (Id)
	)
END
GO

-- INSERT FIELD DATA
IF NOT EXISTS (SELECT * FROM Field WHERE Name = 'Doctor General')
BEGIN
	INSERT INTO Field (Name) VALUES ('Doctor General');
END

IF NOT EXISTS (SELECT * FROM Field WHERE Name = 'Dentista')
BEGIN
	INSERT INTO Field (Name) VALUES ('Dentista');
END

IF NOT EXISTS (SELECT * FROM Field WHERE Name = 'Pediatra')
BEGIN
	INSERT INTO Field (Name) VALUES ('Pediatra');
END

IF NOT EXISTS (SELECT * FROM Field WHERE Name = 'Cirujano')
BEGIN
	INSERT INTO Field (Name) VALUES ('Cirujano');
END

-- INSERT GENDER DATA
IF NOT EXISTS (SELECT * FROM Gender WHERE Name = 'Femenino')
BEGIN
	INSERT INTO Gender(Name) VALUES ('Femenino');
END

IF NOT EXISTS (SELECT * FROM Gender WHERE Name = 'Masculino')
BEGIN
	INSERT INTO Gender (Name) VALUES ('Masculino');
END