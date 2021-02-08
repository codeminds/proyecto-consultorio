USE HospitalDB;
GO

DECLARE @PatientId1 INT;
DECLARE @PatientId2 INT;
DECLARE @PatientId3 INT;
DECLARE @PatientId4 INT;

DECLARE @DoctorId1 INT;
DECLARE @DoctorId2 INT;
DECLARE @DoctorId3 INT;
DECLARE @DoctorId4 INT;


-- INSERT PATIENTS
IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '123456789')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, Gender) VALUES ('123456789', 'Paciente', 'Uno', '1992-01-30 11:00:00.000', 1);
	SET @PatientId1 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @PatientId1 = Id FROM Patient WHERE DocumentId = '123456789';
END

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '234567890')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, Gender) VALUES ('234567890', 'Paciente', 'Dos', '1990-05-11 15:00:00.000', 0);
	SET @PatientId2 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @PatientId2 = Id FROM Patient WHERE DocumentId = '234567890';
END


IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '345678901')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, Gender) VALUES ('345678901', 'Paciente', 'Tres', '2005-06-01 00:00:00.000', 1);
	SET @PatientId3 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @PatientId3 = Id FROM Patient WHERE DocumentId = '345678901';
END


IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '456789012')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, Gender) VALUES ('456789012', 'Paciente', 'Cuatro', '2010-12-01 10:45:00.000', 0);
	SET @PatientId4 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @PatientId4 = Id FROM Patient WHERE DocumentId = '456789012';
END


-- INSERT DOCTORS
IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '524857652')
BEGIN
	DECLARE @GeneralDoctorId INT;
	SELECT TOP 1 @GeneralDoctorId = Id FROM Field WHERE Name = 'Doctor General';
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('524857652', 'Doctor', 'General', @GeneralDoctorId);
	SET @DoctorId1 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @DoctorId1 = Id FROM Doctor WHERE DocumentId = '524857652';
END

IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '547412586')
BEGIN
	DECLARE @DentistId INT;
	SELECT TOP 1 @DentistId = Id FROM Field WHERE Name = 'Dentista';
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('547412586', 'Doctor', 'Dentista', @DentistId);
	SET @DoctorId2 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @DoctorId2 = Id FROM Doctor WHERE DocumentId = '547412586';
END


IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '125846589')
BEGIN
	DECLARE @SurgeonId INT;
	SELECT TOP 1 @SurgeonId = Id FROM Field WHERE Name = 'Cirujano';
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('125846589', 'Doctor', 'Cirujano', @SurgeonId);
	SET @DoctorId3 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @DoctorId3 = Id FROM Doctor WHERE DocumentId = '125846589';
END

IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '352485412')
BEGIN
	DECLARE @PediatricsId INT;
	SELECT TOP 1 @PediatricsId = Id FROM Field WHERE Name = 'Pediatra';
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('352485412', 'Doctor', 'Pediatra', @PediatricsId);
	SET @DoctorId4 = SCOPE_IDENTITY();
END
ELSE
BEGIN
	SELECT TOP 1 @DoctorId4 = Id FROM Doctor WHERE DocumentId = '352485412';
END

-- INSERT APPOINTMENTS
IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @PatientId1 AND DoctorId = @DoctorId3)
BEGIN
	INSERT INTO Appointment(Date, PatientId, DoctorId) VALUES ('2021-01-02 11:00:00.000', @PatientId1, @DoctorId3);
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @PatientId2 AND DoctorId = @DoctorId4)
BEGIN
	INSERT INTO Appointment(Date, PatientId, DoctorId) VALUES ('2021-01-02 15:30:00.000', @PatientId2, @DoctorId4);
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @PatientId3 AND DoctorId = @DoctorId3)
BEGIN
	INSERT INTO Appointment(Date, PatientId, DoctorId) VALUES ('2020-12-20 20:45:00.000', @PatientId3, @DoctorId3);
END