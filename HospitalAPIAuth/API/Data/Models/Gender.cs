using System;
using System.Collections.Generic;

namespace API.Data.Models
{
    public partial class Gender
    {
        public Gender()
        {
            Patient = new HashSet<Patient>();
        }

        public int Id { get; set; }
        public string Name { get; set; } = null!;

        public virtual ICollection<Patient> Patient { get; set; }
    }
}
