using ThinkItFast.Models;

namespace ThinkItFast.Repository.Interfaces
{
    public interface IResult<TEntity>
    {
        Task<IEnumerable<QuizAttempt>> GetAttemptHistory(string argCandidateID);
        Task<IEnumerable<QuizReport>> ScoreReport(ReqReport argRpt);
        Task<int> AddResult(List<TEntity> entity);
        Task<string> GetCertificateString(ReqCertificate argRpt);
    }
}