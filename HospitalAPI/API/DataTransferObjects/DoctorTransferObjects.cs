﻿namespace API.DataTransferObjects
{
    public class GetDoctorDTO
    {
        public int Id { get; set; }
        public string Identification { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public GetFieldDTO Field { get; set; }
    }

    public class CreateUpdateDoctorDTO
    {
        public string Identification { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int FieldId { get; set; }
    }

    public class FilterDoctorDTO 
    {
        public string Identification { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int? FieldId { get; set; }
    }
}
