using System;
using System.Collections.Generic;

namespace API.Data.Models
{
    public partial class Doctor
    {
        public Doctor()
        {
            Appointment = new HashSet<Appointment>();
        }

        public int Id { get; set; }
        public string DocumentId { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public int FieldId { get; set; }

        public virtual Field Field { get; set; } = null!;
        public virtual ICollection<Appointment> Appointment { get; set; }
    }
}
