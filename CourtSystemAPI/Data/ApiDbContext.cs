using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using CourtSystemAPI.Models;

namespace CourtSystemAPI.Data
{
    public class ApiDbContext : IdentityDbContext
    {
        public virtual DbSet<User> User { get; set; }
        public virtual DbSet<Arrest> Arrests { get; set; }
        public ApiDbContext(DbContextOptions<ApiDbContext> options)
            : base(options)
        {

        }
    }
}