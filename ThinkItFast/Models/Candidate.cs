using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ThinkItFast.Models
{
    public class Candidate:BaseEntity
    {
        [Key]
        public int Sl_No { get; set; }

        [Column(TypeName = "varchar(250)")]
        public string Name { get; set; }

        [Column(TypeName = "varchar(250)")]
        public string Email { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string Phone { get; set; }

        [Column(TypeName = "varchar(20)")]
        public string Candidate_ID { get; set; }

        [Column(TypeName = "varchar(100)")]
        public string Roles { get; set; }

        [Column(TypeName = "varchar(250)")]
        public string Password { get; set; }

        [MaxLength]
        public string? ImgFile { get; set; }
    }
}
