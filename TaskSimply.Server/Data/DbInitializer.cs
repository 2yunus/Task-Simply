using Microsoft.EntityFrameworkCore;
using TaskSimply.Server.Models;

namespace TaskSimply.Server.Data
{
    public static class DbInitializer
    {
        public static void Initialize(ApplicationDbContext context)
        {
            // Ensure database is created
            context.Database.EnsureCreated();

            // Check if we already have users
            if (context.Users.Any())
            {
                return; // Database has been seeded
            }

            // Create admin user
            var adminUser = new User
            {
                Username = "admin",
                Email = "admin@tasksimply.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                Role = "Admin",
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(adminUser);
            context.SaveChanges();
        }
    }
} 