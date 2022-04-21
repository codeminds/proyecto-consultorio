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
        public virtual DbSet<Role> Role { get; set; } = null!;
        public virtual DbSet<Session> Session { get; set; } = null!;
        public virtual DbSet<User> User { get; set; } = null!;

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

            modelBuilder.Entity<Role>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Name).HasMaxLength(50);
            });

            modelBuilder.Entity<Session>(entity =>
            {
                entity.Property(e => e.Id).HasDefaultValueSql("(newid())");

                entity.Property(e => e.RefreshToken)
                    .HasMaxLength(32)
                    .IsFixedLength();

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Session)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FKUserSessionUserId");
            });

            modelBuilder.Entity<User>(entity =>
            {
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

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.User)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FKRoleUserRoleId");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
