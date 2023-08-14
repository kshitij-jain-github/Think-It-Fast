using ThinkItFast.Models.QnAs;
using ThinkItFast.Models.Students;

namespace ThinkItFast.Models.Tests
{
    public class TestResult
    {
        public int Id { get; set; }
        public int Answer { get; set; }
        public int StudentId { get; set; }
        public Student Student { get; set; }
        public int QnAId { get; set; }  
        public QnA QnA { get; set; }
        public int TestId { get; set; }
        public Test Test { get; set; }
    }
}
