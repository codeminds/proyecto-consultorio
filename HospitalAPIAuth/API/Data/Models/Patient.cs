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
        public DateTime BirthDate { get; set; }
        public int GenderId { get; set; }

        public virtual Gender Gender { get; set; } = null!;
        public virtual ICollection<Appointment> Appointment { get; set; }
    }
}
