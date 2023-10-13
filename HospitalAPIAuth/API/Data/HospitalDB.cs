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

    public virtual DbSet<Patient> Patient { get; set; }

    public virtual DbSet<Role> Role { get; set; }

    public virtual DbSet<Session> Session { get; set; }

    public virtual DbSet<Status> Status { get; set; }

    public virtual DbSet<User> User { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=HospitalDB");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKAppointment");

            entity.HasIndex(e => new { e.Date, e.PatientId, e.DoctorId, e.StatusId }, "IXAppointmentLookup");

            entity.HasOne(d => d.Doctor).WithMany(p => p.Appointment)
                .HasForeignKey(d => d.DoctorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKDoctorAppointmentDoctorId");

            entity.HasOne(d => d.Patient).WithMany(p => p.Appointment)
                .HasForeignKey(d => d.PatientId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKPatientAppointmentPatientId");

            entity.HasOne(d => d.Status).WithMany(p => p.Appointment)
                .HasForeignKey(d => d.StatusId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKStatusAppointmentStatusId");
        });

        modelBuilder.Entity<Doctor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKDoctor");

            entity.HasIndex(e => new { e.Code, e.FirstName, e.LastName, e.FieldId }, "IXDoctorLookup");

            entity.HasIndex(e => e.Code, "UXDoctorCode").IsUnique();

            entity.Property(e => e.Code)
                .HasMaxLength(10)
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

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Patient>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKPatient");

            entity.HasIndex(e => new { e.DocumentId, e.FirstName, e.LastName, e.Tel, e.Email }, "IXPatientLookup");

            entity.HasIndex(e => e.DocumentId, "UXPatientDocumentId").IsUnique();

            entity.HasIndex(e => e.Email, "UXPatientEmail").IsUnique();

            entity.Property(e => e.DocumentId)
                .HasMaxLength(9)
                .IsUnicode(false);
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Tel)
                .HasMaxLength(8)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKRole");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name).HasMaxLength(50);
        });

        modelBuilder.Entity<Session>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKSession");

            entity.HasIndex(e => new { e.AddressIssued, e.AddressRefreshed, e.DateIssued }, "IXSessionLookup");

            entity.HasIndex(e => e.SessionId, "UXSessionSessionId").IsUnique();

            entity.Property(e => e.AddressIssued)
                .HasMaxLength(40)
                .IsUnicode(false);
            entity.Property(e => e.AddressRefreshed)
                .HasMaxLength(40)
                .IsUnicode(false);
            entity.Property(e => e.RefreshToken)
                .HasMaxLength(64)
                .IsFixedLength();

            entity.HasOne(d => d.User).WithMany(p => p.Session)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKUserSessionUserId");
        });

        modelBuilder.Entity<Status>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKStatus");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PKUser");

            entity.HasIndex(e => new { e.Email, e.FirstName, e.LastName, e.RoleId }, "IXUserLookup");

            entity.HasIndex(e => e.Email, "UXUserEmail").IsUnique();

            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FirstName).HasMaxLength(50);
            entity.Property(e => e.LastName).HasMaxLength(50);
            entity.Property(e => e.Password)
                .HasMaxLength(64)
                .IsFixedLength();
            entity.Property(e => e.PasswordSalt)
                .HasMaxLength(64)
                .IsFixedLength();

            entity.HasOne(d => d.Role).WithMany(p => p.User)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FKRoleUserRoleId");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
