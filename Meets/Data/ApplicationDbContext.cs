//using System;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using Meets.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Meets.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, ulong>
    {
        public virtual DbSet<Subscribtion> Subscribtions { get; set; }

        public virtual DbSet<Meeting> Meetings { get; set; }
                
        public virtual DbSet<Message> Messages { get; set; }


        public virtual DbSet<Learning> Learnings { get; set; }

        public virtual DbSet<Work> Works { get; set; }

        public virtual DbSet<Models.Activity> Activities { get; set; }

        public virtual DbSet<Fact> Facts { get; set; }





        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) => optionsBuilder.LogTo(message => Debug.WriteLine(message));

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ApplicationUser>()
                .Property(e => e.Tags)
                .HasDefaultValue("");

            modelBuilder.Entity<ApplicationUser>()
                .Property(e => e.Tags)
                .IsRequired();




            modelBuilder.Entity<Subscribtion>()
                .HasOne(x => x.Target)
                .WithMany(x => x.Subscribers)
                .HasForeignKey(x => x.TargetId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Subscribtion>()
                .HasOne(x => x.Owner)
                .WithMany(x => x.Subscribtions)
                .HasForeignKey(x => x.OwnerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Subscribtion>()
                .HasKey(l => new { l.OwnerId, l.TargetId });


            modelBuilder.Entity<Meeting>()
                .HasOne(x => x.Target)
                .WithMany(x => x.IncomingMeetings)
                .HasForeignKey(x => x.TargetId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Meeting>()
                .HasOne(x => x.Owner)
                .WithMany(x => x.OutgoingMeetings)
                .HasForeignKey(x => x.OwnerId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Meeting>()
                .HasKey(l => l.Id);




            modelBuilder.Entity<Message>()
                .HasOne(x => x.Meeting)
                .WithMany(x => x.Messages)
                .HasForeignKey(x => x.MeetingId)
                .OnDelete(DeleteBehavior.NoAction);


            modelBuilder.Entity<Message>()
                .HasKey(l => new { l.Id, l.MeetingId });









            modelBuilder.Entity<Learning>()
                .HasOne(x => x.User)
                .WithMany(x => x.Learnings)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<Work>()
                .HasOne(x => x.User)
                .WithMany(x => x.Works)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<Fact>()
                .HasOne(x => x.User)
                .WithMany(x => x.Facts)
                .HasForeignKey(x => x.UserId);

            modelBuilder.Entity<Models.Activity>()
                .HasOne(x => x.User)
                .WithMany(x => x.Activities)
                .HasForeignKey(x => x.UserId);






            modelBuilder.Entity<ApplicationRole>().HasData(
                new ApplicationRole 
                { 
                    Id = 1, 
                    Name = "Administrator", 
                    NormalizedName = "ADMINISTRATOR".ToUpper(),
                    ConcurrencyStamp = "4a35fd22-2f62-487d-966c-cb2b18ce6729"
                });


            //a hasher to hash the password before seeding the user to the db
            var hasher = new PasswordHasher<ApplicationUser>();


            //Seeding the User to AspNetUsers table
            modelBuilder.Entity<ApplicationUser>().HasData(
                new ApplicationUser
                {
                    Id = 1, 
                    UserName = "admin@admin",
                    FullName = "Администратор",
                    NormalizedUserName = "admin@admin".ToUpper(),
                    Email = "admin@admin",
                    NormalizedEmail = "admin@admin",
                    PasswordHash = "AQAAAAEAACcQAAAAENx3L07KWVLeM5I4Gl87fgefl6BbDM98CTVFpDmkbUgI+CstAB1oaMPITqT4DQ4r4g==",  // hasher.HashPassword(null, "admin@admin"),
                    SecurityStamp = "b8db65e3-df56-4cc6-ad87-16e1c108db13",
                    ConcurrencyStamp = "3a770767-445a-4eef-93a3-2389c7949bb5"
                }
           );

            //Seeding the relation between our user and role to AspNetUserRoles table
            modelBuilder.Entity<IdentityUserRole<ulong>>().HasData(
                new IdentityUserRole<ulong>
                {
                    RoleId = 1,
                    UserId = 1
                },
                new IdentityUserRole<ulong>
                {
                    RoleId = 1,
                    UserId = 2
                }
            );
        }
    }
}
