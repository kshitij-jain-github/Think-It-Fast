using System.ComponentModel.DataAnnotations;

namespace ThinkItFast.Models
{
    public class Question : BaseEntity  
    {
        [Key]
        public int QuestionID { get; set; }
        public int QuestionType { get; set; }  //MCQ-1      
        public string DisplayText { get; set; }
        public int ExamID { get; set; }
    }
}
