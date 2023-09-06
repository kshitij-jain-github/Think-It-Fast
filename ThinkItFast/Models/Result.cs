using System.ComponentModel.DataAnnotations;

namespace ThinkItFast.Models
{
    public class Result : BaseEntity
    {
        [Key]
        public int Sl_No { get; set; }

        [MaxLength]
        public string SessionID { get; set; }
        public int CandidateID { get; set; }
        public int ExamID { get; set; }
        public int QuestionID { get; set; }
        public int AnswerID { get; set; }
        public int SelectedOptionID { get; set; }
        public bool IsCorrent { get; set; }
  
    }
}
