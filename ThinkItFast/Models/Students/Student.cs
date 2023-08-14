using System.ComponentModel.DataAnnotations;
using ThinkItFast.Models.Batches;

namespace ThinkItFast.Models.Students
{
    public class Student
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Username { get; set; }
        public string Password { get; set;}

       [ DataType(DataType.PhoneNumber)]
        public int Phone { get; set; }

        public string ProfilePhoto { get; set; }
        public int BatchId { get; set; }
        public Batch Batch { get; set; }
    }
}
