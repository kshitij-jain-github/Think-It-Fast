using System.ComponentModel.DataAnnotations;
using ThinkItFast.Models.Batches;

namespace ThinkItFast.Models.User
{
    public class Users
    {
        public int Id { get; set; }
        public string Name { get; set; }    
        public string Username { get; set; }

        [DataType(DataType.Password)]       
        public string Password { get; set; }    
        public int Role { get; set; }
        public ICollection<Batch> Batch { get; set; } = new HashSet<Batch>();

    }
}
