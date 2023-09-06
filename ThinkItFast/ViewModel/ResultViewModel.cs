using System.ComponentModel.DataAnnotations;

namespace ThinkItFast.ViewModel
{
    public class ResultViewModel
    {
        [Required]
        public int CandidateID;
        [Required]
        public int ExamID;
        [Required]
        public int QuestionID;
        [Required]
        public int AnswerID;
        [Required]
        public int SelectedOption;
    }
}
