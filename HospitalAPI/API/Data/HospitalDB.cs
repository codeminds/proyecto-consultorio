using System;
using System.Collections.Generic;
using API.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public partial class HospitalDB : DbContext
{
   public HospitalDB()
   {
   }

   public HospitalDB(DbContextOptions<HospitalDB> options)
       : base(options)
   {
   }

   public virtual DbSet<Appointment> Appointment { get; set; }

   public virtual DbSet<Doctor> Doctor { get; set; }

   public virtual DbSet<Field> Field { get; set; }

   public virtual DbSet<Gender> Gender { get; set; }

   public virtual DbSet<Patient> Patient { get; set; }

   protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
       => optionsBuilder.UseSqlServer("Name=HospitalDB");

   protected override void OnModelCreating(ModelBuilder modelBuilder)
   {
      modelBuilder.Entity<Appointment>(entity =>
      {
         entity.HasKey(e => e.Id).HasName("PKAppointment");

         entity.HasOne(d => d.Doctor).WithMany(p => p.Appointment)
               .HasForeignKey(d => d.DoctorId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FKDoctorAppointmentDoctorId");

         entity.HasOne(d => d.Patient).WithMany(p => p.Appointment)
               .HasForeignKey(d => d.PatientId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FKPatientAppointmentPatientId");
      });

      modelBuilder.Entity<Doctor>(entity =>
      {
         entity.HasKey(e => e.Id).HasName("PKDoctor");

         entity.HasIndex(e => e.DocumentId, "UXDoctorDocumentId").IsUnique();

         entity.Property(e => e.DocumentId)
               .HasMaxLength(9)
               .IsUnicode(false);
         entity.Property(e => e.FirstName)
               .HasMaxLength(50)
               .IsUnicode(false);
         entity.Property(e => e.LastName)
               .HasMaxLength(50)
               .IsUnicode(false);

         entity.HasOne(d => d.Field).WithMany(p => p.Doctor)
               .HasForeignKey(d => d.FieldId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FKFieldDoctorFieldId");
      });

      modelBuilder.Entity<Field>(entity =>
      {
         entity.HasKey(e => e.Id).HasName("PKField");

         entity.Property(e => e.Name)
               .HasMaxLength(50)
               .IsUnicode(false);
      });

      modelBuilder.Entity<Gender>(entity =>
      {
         entity.HasKey(e => e.Id).HasName("PKGender");

         entity.Property(e => e.Name)
               .HasMaxLength(50)
               .IsUnicode(false);
      });

      modelBuilder.Entity<Patient>(entity =>
      {
         entity.HasKey(e => e.Id).HasName("PKPatient");

         entity.HasIndex(e => e.DocumentId, "UXPatientDocumentId").IsUnique();

         entity.Property(e => e.DocumentId)
               .HasMaxLength(9)
               .IsUnicode(false);
         entity.Property(e => e.FirstName)
               .HasMaxLength(50)
               .IsUnicode(false);
         entity.Property(e => e.LastName)
               .HasMaxLength(50)
               .IsUnicode(false);

         entity.HasOne(d => d.Gender).WithMany(p => p.Patient)
               .HasForeignKey(d => d.GenderId)
               .OnDelete(DeleteBehavior.ClientSetNull)
               .HasConstraintName("FKGenderPatientGenderId");
      });

      OnModelCreatingPartial(modelBuilder);
   }

   partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
