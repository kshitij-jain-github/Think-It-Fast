using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ThinkItFast.Models.Batches;
using ThinkItFast.Models.QnAs;
using ThinkItFast.Models.Students;
using ThinkItFast.Models.Tests;
using ThinkItFast.Models.User;

namespace ThinkItFast.Models
{
    public class ApplicationDbContext:IdentityDbContext
    {
        public ApplicationDbContext()
        {
            
        }
        public ApplicationDbContext( DbContextOptions<ApplicationDbContext> options):base( options)
        {
            
        }
        public DbSet<Users> User { get; set; }
        public DbSet<Student> Student{ get; set; }
        public DbSet<Batch> Batch { get; set; }
        public DbSet<QnA> QnA { get; set; }
        public DbSet<Test> Test { get; set; }
        public DbSet<TestResult> TestResult { get; set; }
    }
}
