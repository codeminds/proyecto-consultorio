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

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '475869589')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, Tel, Email) VALUES ('475869589', 'Ernesto', 'Chan', '76554534', 'ernesto@chan.com')
END

IF NOT EXISTS (SELECT * FROM Patient WHERE DocumentId = '756453647')
BEGIN
	INSERT INTO Patient (DocumentId, FirstName, LastName, Tel, Email) VALUES ('756453647', 'Carlos', 'Mora', '87665475', 'carlos@mora.com')
END


-- INSERT DOCTORS

IF NOT EXISTS (SELECT * FROM Doctor WHERE Code = '53647586')
BEGIN
	INSERT INTO Doctor (Code, FirstName, LastName, FieldId) VALUES ('53647586', 'Carlos', 'Jimenez', 1)
END

IF NOT EXISTS (SELECT * FROM Doctor WHERE Code = '64536456')
BEGIN
	INSERT INTO Doctor (Code, FirstName, LastName, FieldId) VALUES ('64536456', 'Juan', 'Perez', 2)
END

IF NOT EXISTS (SELECT * FROM Doctor WHERE Code = '54443234')
BEGIN
	INSERT INTO Doctor (Code, FirstName, LastName, FieldId) VALUES ('54443234', 'Karla', 'Hernandez', 3)
END

IF NOT EXISTS (SELECT * FROM Doctor WHERE Code = '44354323')
BEGIN
	INSERT INTO Doctor (Code, FirstName, LastName, FieldId) VALUES ('44354323', 'Luis', 'Blanco', 4)
END


-- INSERT APPOINTMENTS

DECLARE @Patient1 INT
SELECT @Patient1 = Id FROM Patient WHERE DocumentId = '123456789'

DECLARE @Patient2 INT
SELECT @Patient2 = Id FROM Patient WHERE DocumentId = '234567890'

DECLARE @Patient3 INT
SELECT @Patient3 = Id FROM Patient WHERE DocumentId = '475869589'

DECLARE @Patient4 INT
SELECT @Patient4 = Id FROM Patient WHERE DocumentId = '756453647'

DECLARE @Doctor1 INT
SELECT @Doctor1 = Id FROM Doctor WHERE Code = '53647586'

DECLARE @Doctor2 INT
SELECT @Doctor2 = Id FROM Doctor WHERE Code = '64536456'

DECLARE @Doctor3 INT
SELECT @Doctor3 = Id FROM Doctor WHERE Code = '54443234'

DECLARE @Doctor4 INT
SELECT @Doctor4 = Id FROM Doctor WHERE Code = '44354323'

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient1 AND DoctorId = @Doctor1)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2021-01-02 11:00:00', @Patient1, @Doctor1, 1)
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient2 AND DoctorId = @Doctor2)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2021-01-03 11:00:00', @Patient2, @Doctor2, 2)
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient1 AND DoctorId = @Doctor2)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2021-01-02 15:30:00', @Patient1, @Doctor2, 1)
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient3 AND DoctorId = @Doctor3)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2020-12-20 20:45:00', @Patient3, @Doctor3, 1)
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient2 AND DoctorId = @Doctor2)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2023-01-01 17:00:00', @Patient3, @Doctor4, 2)
END

IF NOT EXISTS (SELECT * FROM Appointment WHERE PatientId = @Patient2 AND DoctorId = @Doctor1)
BEGIN
	INSERT INTO Appointment ([Date], PatientId, DoctorId, StatusId) VALUES ('2022-05-05 08:00:00', @Patient2, @Doctor1, 1)
END

-- INSERT USERS (Passwords generados con PBKDF2 utlizando SHA512 con 10234 iteraciones. Password es: 123)

-- test@admin.com 123 Test Admin 1
IF NOT EXISTS (SELECT * FROM [User] WHERE Email = 'test@admin.com')
BEGIN
	INSERT INTO [User](Email, [Password], PasswordSalt, FirstName, LastName, RoleId) 
		VALUES ('test@admin.com', 
				0x24C9AF1EEE2E22F10100EB81F161A49175CEDD13CEF5A60803F7D6A48C0821840B279BE1587AFB05001AECBFF85519D4F53CA774F988EB90A4593F15E489A329,
				0x313CDDD13107EFAD7DBC0C7004BA469BC1386C106F02038AD98D021E24C49F656794C21FAB1CE93EC337571468E4A82A72544A9210DAACADE2AFC05B83D49B94,
				'Test', 'Admin', 1);
END

-- test@editor.com 123 Test Editor 2
IF NOT EXISTS (SELECT * FROM [User] WHERE Email = 'test@editor.com')
BEGIN
	INSERT INTO [User](Email, [Password], PasswordSalt, FirstName, LastName, RoleId) 
		VALUES ('test@editor.com', 
				0x09AEDB65CD295A3BB37D4DB0D0F222279A39C785430E6C27A4DF59367AA8DEF7C089858DF9CC34580F1A70F51890CB01732BA21919A2069651B8C8E558A3CD57,
				0x52DE244E99648402D8CFE3720BEFA2C17F5DF6A462EB231287FD584D5CEAD4455BF6833991379C35B5ED6BDCC99F9D2CA5B0387BC356C2FD06A1F76EB66C4095,
				'Test', 'Editor', 2);
END

-- test@assistant.com 123 Test Assistant 3
IF NOT EXISTS (SELECT * FROM [User] WHERE Email = 'test@assistant.com')
BEGIN
	INSERT INTO [User](Email, [Password], PasswordSalt, FirstName, LastName, RoleId) 
		VALUES ('test@assistant.com', 
				0x4CF742421343F203C72B5458702701A83AD7618A3526BF39915FD669A551FA3E09A9DDCFA7366F3CD3BEBC37A18C7D4102DC3A1256A3BFD35F0491038B7CCFDF,
				0xA0C29EDC7E8CC5163FB8719CA57013A48D7F294DD6D86ADB498B94F2AD605EF97311746041030989EF49E9B3258ADCD3186CB9698EC9C3D3B8A6DEBF5D7ED1EE,
				'Test', 'Assistant', 3);
END