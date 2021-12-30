using System;
using System.Collections.Generic;

#nullable disable

namespace API.Data.Models
{
    public partial class Patient
    {
        public Patient()
        {
            Appointments = new HashSet<Appointment>();
        }

        public int Id { get; set; }
        public string DocumentId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime BirthDate { get; set; }

        public virtual ICollection<Appointment> Appointments { get; set; }
    }
}
