
using ThinkItFast.Models.Tests;

namespace ThinkItFast.Models.QnAs
{
    public class QnA
    {
        public int Id { get; set; }
        public string   Question { get; set; }
        public int Answer { get; set; }
        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public string Option4 { get; set; }
        public int TestId { get; set; }
        public Test Test { get; set; }
        public ICollection<TestResult> TestResults { get; set; }   = new HashSet<TestResult>();
    }
}
