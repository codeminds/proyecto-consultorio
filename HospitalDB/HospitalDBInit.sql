IF NOT EXISTS (SELECT * FROM sys.databases WHERE [name] = 'HospitalDB')
BEGIN
	CREATE DATABASE HospitalDB
END
GO

USE HospitalDB
GO

-- CREATE FIELD
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE [name] = 'Field' and xtype = 'U')
BEGIN
	CREATE TABLE Field (
		Id INT NOT NULL,
		[Name] VARCHAR(50) NOT NULL,
		CONSTRAINT PKField PRIMARY KEY (Id)
	)
END
GO

-- CREATE DOCTOR
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE [name] = 'Doctor' and xtype = 'U')
BEGIN
	CREATE TABLE Doctor (
		Id INT NOT NULL IDENTITY(1,1),
		Code VARCHAR(10) NOT NULL,
		FirstName VARCHAR(50) NOT NULL,
		LastName VARCHAR(50) NOT NULL,
		FieldId INT NOT NULL,
		CONSTRAINT PKDoctor PRIMARY KEY (Id),
		CONSTRAINT UXDoctorCode UNIQUE (Code),
		CONSTRAINT FKFieldDoctorFieldId FOREIGN KEY (FieldId) REFERENCES Field (Id)
	)
END
GO

-- CREATE PATIENT
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE [name] = 'Patient' and xtype = 'U')
BEGIN
	CREATE TABLE Patient (
		Id INT NOT NULL IDENTITY(1,1),
		DocumentId VARCHAR(9) NOT NULL,
		FirstName VARCHAR(50) NOT NULL,
		LastName VARCHAR(50) NOT NULL,
		Tel VARCHAR(8) NOT NULL,
		Email VARCHAR(100) NOT NULL
		CONSTRAINT PKPatient PRIMARY KEY (Id),
		CONSTRAINT UXPatientDocumentID UNIQUE (DocumentId),
		CONSTRAINT UXPatientEmail UNIQUE (Email)
	)
END
GO

-- CREATE STATUS
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE [name] = 'Status' and xtype = 'U')
BEGIN
	CREATE TABLE [Status] (
		Id INT NOT NULL,
		[Name] VARCHAR(50) NOT NULL,
		CONSTRAINT PKStatus PRIMARY KEY (Id)
	)
END
GO

-- CREATE APPOINTMENT
IF NOT EXISTS (SELECT * FROM sys.sysobjects WHERE [name] = 'Appointment' and xtype = 'U')
BEGIN
	CREATE TABLE Appointment (
		Id INT NOT NULL IDENTITY(1,1),
		[Date] DATETIME2(7) NOT NULL,
		PatientId INT NOT NULL,
		DoctorId INT NOT NULL,
		StatusId INT NOT NULL,
		CONSTRAINT PKAppointment PRIMARY KEY (Id),
		CONSTRAINT FKPatientAppointmentPatientId FOREIGN KEY (PatientId) REFERENCES Patient (Id),
		CONSTRAINT FKDoctorAppointmentDoctorId FOREIGN KEY (DoctorId) REFERENCES Doctor (Id),
		CONSTRAINT FKStatusAppointmentStatusId FOREIGN KEY (StatusId) REFERENCES [Status] (Id)
	)
END
GO

-- INSERT FIELD DATA
IF NOT EXISTS (SELECT * FROM Field WHERE Id = 1)
BEGIN
	INSERT INTO FIeld (Id, Name) VALUES (1, 'Doctor General')
END

IF NOT EXISTS (SELECT * FROM Field WHERE Id = 2)
BEGIN
	INSERT INTO FIeld (Id, Name) VALUES (2, 'Dentista')
END

IF NOT EXISTS (SELECT * FROM Field WHERE Id = 3)
BEGIN
	INSERT INTO FIeld (Id, Name) VALUES (3, 'Pediatra')
END

IF NOT EXISTS (SELECT * FROM Field WHERE Id = 4)
BEGIN
	INSERT INTO FIeld (Id, Name) VALUES (4, 'Cirujano')
END

-- INSERT STATUS DATA 
IF NOT EXISTS (SELECT * FROM [Status] WHERE Id = 1)
BEGIN
	INSERT INTO [Status] (Id, Name) VALUES (1, 'Activa')
END

IF NOT EXISTS (SELECT * FROM [Status] WHERE Id = 2)
BEGIN
	INSERT INTO [Status] (Id, Name) VALUES (2, 'Cancelada')
END