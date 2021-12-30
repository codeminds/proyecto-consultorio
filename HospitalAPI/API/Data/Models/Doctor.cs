using System;
using System.Collections.Generic;

#nullable disable

namespace API.Data.Models
{
    public partial class Doctor
    {
        public Doctor()
        {
            Appointments = new HashSet<Appointment>();
        }

        public int Id { get; set; }
        public string DocumentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int FieldId { get; set; }

        public virtual Field Field { get; set; }
        public virtual ICollection<Appointment> Appointments { get; set; }
    }
}
