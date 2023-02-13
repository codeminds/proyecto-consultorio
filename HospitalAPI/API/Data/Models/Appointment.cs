using System;
using System.Collections.Generic;

namespace API.Data.Models;

public partial class Appointment
{
   public int Id { get; set; }

   public DateTime Date { get; set; }

   public int PatientId { get; set; }

   public int DoctorId { get; set; }

   public virtual Doctor Doctor { get; set; } = null!;

   public virtual Patient Patient { get; set; } = null!;
}
