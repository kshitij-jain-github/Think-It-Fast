using ThinkItFast.Models.Students;
using ThinkItFast.Models.User;
namespace ThinkItFast.Models.Batches
{
    public class Batch
    {
        public int Id { get; set; }
        public string Name { get; set; }    
        public string Description { get; set; }
        public int UserId { get; set; }
        public Users User { get; set; }
        public ICollection<Student> Student { get; set; }
    }
}
