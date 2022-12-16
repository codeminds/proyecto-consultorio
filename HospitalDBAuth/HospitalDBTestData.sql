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

-- INSERT USERS (Passwords generados con PBKDF2 utlizando SHA512 con 10234 iteraciones. Password es: 123)
IF NOT EXISTS (SELECT * FROM [User] WHERE Email = 'test@admin.com')
BEGIN
	DECLARE @AdminId INT;
	SELECT TOP 1 @AdminId = Id FROM Role WHERE Name = 'Administrador';
	INSERT INTO [User](Email, Password, PasswordSalt, FirstName, LastName, RoleId) 
		VALUES ('test@admin.com', 
				0x24C9AF1EEE2E22F10100EB81F161A49175CEDD13CEF5A60803F7D6A48C0821840B279BE1587AFB05001AECBFF85519D4F53CA774F988EB90A4593F15E489A329,
				0x313CDDD13107EFAD7DBC0C7004BA469BC1386C106F02038AD98D021E24C49F656794C21FAB1CE93EC337571468E4A82A72544A9210DAACADE2AFC05B83D49B94,
				'Test', 'Admin', @AdminId);
END

IF NOT EXISTS (SELECT * FROM [User] WHERE Email = 'test@editor.com')
BEGIN
	DECLARE @EditorId INT;
	SELECT TOP 1 @EditorId = Id FROM Role WHERE Name = 'Editor';
	INSERT INTO [User](Email, Password, PasswordSalt, FirstName, LastName, RoleId) 
		VALUES ('test@editor.com', 
				0x09AEDB65CD295A3BB37D4DB0D0F222279A39C785430E6C27A4DF59367AA8DEF7C089858DF9CC34580F1A70F51890CB01732BA21919A2069651B8C8E558A3CD57,
				0x52DE244E99648402D8CFE3720BEFA2C17F5DF6A462EB231287FD584D5CEAD4455BF6833991379C35B5ED6BDCC99F9D2CA5B0387BC356C2FD06A1F76EB66C4095,
				'Test', 'Editor', @EditorId);
END

IF NOT EXISTS (SELECT * FROM [User] WHERE Email = 'test@assistant.com')
BEGIN
	DECLARE @AssistantId INT;
	SELECT TOP 1 @AssistantId = Id FROM Role WHERE Name = 'Asistente';
	INSERT INTO [User](Email, Password, PasswordSalt, FirstName, LastName, RoleId) 
		VALUES ('test@assistant.com', 
				0x4CF742421343F203C72B5458702701A83AD7618A3526BF39915FD669A551FA3E09A9DDCFA7366F3CD3BEBC37A18C7D4102DC3A1256A3BFD35F0491038B7CCFDF,
				0xA0C29EDC7E8CC5163FB8719CA57013A48D7F294DD6D86ADB498B94F2AD605EF97311746041030989EF49E9B3258ADCD3186CB9698EC9C3D3B8A6DEBF5D7ED1EE,
				'Test', 'Assistant', @AssistantId);
END