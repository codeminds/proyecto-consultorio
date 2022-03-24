using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using API.Data.Models;

namespace API.Data
{
    public partial class HospitalDB : DbContext
    {
        public HospitalDB()
        {
        }

        public HospitalDB(DbContextOptions<HospitalDB> options)
            : base(options)
        {
        }

        public virtual DbSet<Appointment> Appointment { get; set; } = null!;
        public virtual DbSet<Doctor> Doctor { get; set; } = null!;
        public virtual DbSet<Field> Field { get; set; } = null!;
        public virtual DbSet<Patient> Patient { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer("Name=HospitalDB");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.HasOne(d => d.Doctor)
                    .WithMany(p => p.Appointment)
                    .HasForeignKey(d => d.DoctorId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FKDoctorAppointmentDoctorId");

                entity.HasOne(d => d.Patient)
                    .WithMany(p => p.Appointment)
                    .HasForeignKey(d => d.PatientId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FKPatientAppointmentPatientId");
            });

            modelBuilder.Entity<Doctor>(entity =>
            {
                entity.HasIndex(e => e.DocumentId, "UXDoctorDocumentId")
                    .IsUnique();

                entity.Property(e => e.DocumentId)
                    .HasMaxLength(9)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.LastName).HasMaxLength(50);

                entity.HasOne(d => d.Field)
                    .WithMany(p => p.Doctor)
                    .HasForeignKey(d => d.FieldId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FKFieldDoctorFieldId");
            });

            modelBuilder.Entity<Field>(entity =>
            {
                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<Patient>(entity =>
            {
                entity.HasIndex(e => e.DocumentId, "UXPatientDocumentId")
                    .IsUnique();

                entity.Property(e => e.DocumentId)
                    .HasMaxLength(9)
                    .IsUnicode(false);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.LastName).HasMaxLength(50);
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
