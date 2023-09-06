using System.ComponentModel.DataAnnotations;

namespace ThinkItFast.Models
{
    public class Choice:BaseEntity
    {
        [Key]
        public int ChoiceID { get; set; }
        public int QuestionID { get; set; }
        public string DisplayText { get; set; }
    }
}
