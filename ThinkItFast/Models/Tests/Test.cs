using System;
using ThinkItFast.Models.Batches;
using ThinkItFast.Models.QnAs;

namespace ThinkItFast.Models.Tests
{
    public class Test
    {
        public int Id { get; set; }
        public string Title { get; set; }    
        public string Description { get; set; } 
        public DateTime StartDate { get; set; }  
        public int Duration { get; set; }
        public int BatchId { get; set; }
        public Batch Batch { get; set; }
        public ICollection<TestResult> TestResult { get; set; } = new HashSet<TestResult>();

        public ICollection<QnA> QnA { get; set; }
    }
}
