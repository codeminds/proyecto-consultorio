USE HospitalDB;
GO

DECLARE @GenderMasculineId INT;
SELECT TOP 1 @GenderMasculineId = Id FROM Gender WHERE Name = 'Masculino';

DECLARE @GenderFeminineId INT;
SELECT TOP 1 @GenderFeminineId = Id FROM Gender WHERE Name = 'Femenino';

DECLARE @GeneralDoctorId INT;
SELECT TOP 1 @GeneralDoctorId = Id FROM Field WHERE Name = 'Doctor General';

DECLARE @DentistDoctorId INT;
SELECT TOP 1 @DentistDoctorId = Id FROM Field WHERE Name = 'Dentista';

DECLARE @SurgeonDoctorId INT;
SELECT TOP 1 @SurgeonDoctorId = Id FROM Field WHERE Name = 'Cirujano';

DECLARE @PediatricianDoctorId INT;
SELECT TOP 1 @PediatricianDoctorId = Id FROM Field WHERE Name = 'Pediatra';


-- INSERT PATIENTS
IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '123456789')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, GenderId) VALUES ('123456789', 'Paciente', 'Uno', '1992-01-30 11:00:00.000', @GenderMasculineId);
END
DECLARE @PatientId1 INT;
SELECT TOP 1 @PatientId1 = Id FROM Patient WHERE DocumentId = '123456789';

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '234567890')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, GenderId) VALUES ('234567890', 'Paciente', 'Dos', '1990-05-11 15:00:00.000', @GenderFeminineId);
END
DECLARE @PatientId2 INT;
SELECT TOP 1 @PatientId2 = Id FROM Patient WHERE DocumentId = '234567890';

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '345678901')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, GenderId) VALUES ('345678901', 'Paciente', 'Tres', '2005-06-01 00:00:00.000', @GenderMasculineId);
END
DECLARE @PatientId3 INT;
SELECT TOP 1 @PatientId3 = Id FROM Patient WHERE DocumentId = '345678901';

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '456789012')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, BirthDate, GenderId) VALUES ('456789012', 'Paciente', 'Cuatro', '2010-12-01 10:45:00.000', @GenderFeminineId);
END
DECLARE @PatientId4 INT;
SELECT TOP 1 @PatientId4 = Id FROM Patient WHERE DocumentId = '456789012';

-- INSERT DOCTORS
IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '524857652')
BEGIN
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('524857652', 'Doctor', 'General', @GeneralDoctorId);
END
DECLARE @DoctorId1 INT;
SELECT TOP 1 @DoctorId1 = Id FROM Doctor WHERE DocumentId = '524857652';

IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '547412586')
BEGIN
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('547412586', 'Doctor', 'Dentista', @DentistDoctorId);
END
DECLARE @DoctorId2 INT;
SELECT TOP 1 @DoctorId2 = Id FROM Doctor WHERE DocumentId = '547412586';

IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '125846589')
BEGIN
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('125846589', 'Doctor', 'Cirujano', @SurgeonDoctorId);
END
DECLARE @DoctorId3 INT;
SELECT TOP 1 @DoctorId3 = Id FROM Doctor WHERE DocumentId = '125846589';

IF NOT EXISTS (SELECT * FROM Doctor WHERE DocumentId = '352485412')
BEGIN
	INSERT INTO Doctor (DocumentId, FirstName, LastName, FieldId) VALUES ('352485412', 'Doctor', 'Pediatra', @PediatricianDoctorId);
END
DECLARE @DoctorId4 INT;
SELECT TOP 1 @DoctorId4 = Id FROM Doctor WHERE DocumentId = '352485412';

-- INSERT APPOINTMENTS
IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @PatientId1 AND DoctorId = @DoctorId1)
BEGIN
	INSERT INTO Appointment (Date, PatientId, DoctorId) VALUES ('2021-01-02 11:00:00.000', @PatientId1, @DoctorId1);
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @PatientId2 AND DoctorId = @DoctorId4)
BEGIN
	INSERT INTO Appointment (Date, PatientId, DoctorId) VALUES ('2021-01-02 15:30:00.000', @PatientId2, @DoctorId4);
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @PatientId3 AND DoctorId = @DoctorId3)
BEGIN
	INSERT INTO Appointment (Date, PatientId, DoctorId) VALUES ('2020-12-20 20:45:00.000', @PatientId3, @DoctorId3);
END