using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace ThinkItFast.Models
{
    public class Exam:BaseEntity
    {
        [Key]
        public int ExamID { get; set; }

        [Column(TypeName = "varchar(1000)")]
        public string Name { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal FullMarks { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Duration { get; set; }
    }
}
