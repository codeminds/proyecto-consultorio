USE HospitalDB
GO

-- INSERT PATIENTS

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '123456789')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, Tel, Email) VALUES ('123456789', 'Daniel', 'Mora', '35475654', 'daniel@mora.com')
END

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '234567890')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, Tel, Email) VALUES ('234567890', 'Josue', 'Sanchez', '84751236', 'josue@sanchez.com')
END

-- 475869589 Ernesto Chan 76554534 ernesto@chan.com
-- 756453647 Carlos Mora 87665475 carlos@mora.com


-- INSERT DOCTORS

IF NOT EXISTS (SELECT * FROM Doctor WHERE Code = '53647586')
BEGIN
	INSERT INTO Doctor (Code, FirstName, LastName, FieldId) VALUES ('53647586', 'Carlos', 'Jimenez', 1)
END

IF NOT EXISTS (SELECT * FROM Doctor WHERE Code = '64536456')
BEGIN
	INSERT INTO Doctor (Code, FirstName, LastName, FieldId) VALUES ('64536456', 'Juan', 'Perez', 2)
END

-- 54443234 Karla Hernandez 3
-- 44354323 Luis Blanco 4


-- INSERT APPOINTMENTS

DECLARE @Patient1 INT
SELECT @Patient1 = Id FROM Patient WHERE DocumentId = '123456789'

DECLARE @Patient2 INT
SELECT @Patient2 = Id FROM Patient WHERE DocumentId = '234567890'

DECLARE @Doctor1 INT
SELECT @Doctor1 = Id FROM Doctor WHERE Code = '53647586'

DECLARE @Doctor2 INT
SELECT @Doctor2 = Id FROM Doctor WHERE Code = '64536456'

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient1 AND DoctorId = @Doctor1)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2021-01-02 11:00:00', @Patient1, @Doctor1, 1)
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient2 AND DoctorId = @Doctor2)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2021-01-03 11:00:00', @Patient2, @Doctor2, 2)
END

-- 2021-01-02 15:30:00 Paciente1 Doctor2 1
-- 2020-12-20 20:45:00 Paciente3 Doctor3 1
-- 2023-01-01 17:00:00 Paciente3 Doctor4 2
-- 2022-05-05 08:00:00 Paciente2 Doctor1 1