using System;
using System.Collections.Generic;

#nullable disable

namespace API.Data.Models
{
    public partial class Field
    {
        public Field()
        {
            Doctors = new HashSet<Doctor>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Doctor> Doctors { get; set; }
    }
}
