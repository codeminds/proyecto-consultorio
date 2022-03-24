using System;
using System.Collections.Generic;

namespace API.Data.Models
{
    public partial class Patient
    {
        public Patient()
        {
            Appointment = new HashSet<Appointment>();
        }

        public int Id { get; set; }
        public string DocumentId { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public bool Gender { get; set; }
        public DateTime BirthDate { get; set; }

        public virtual ICollection<Appointment> Appointment { get; set; }
    }
}
