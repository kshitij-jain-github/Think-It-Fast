using System.Linq.Expressions;
using ThinkItFast.Models;

namespace ThinkItFast.Repository.Interfaces
{
    public interface IQuestion<TEntity>
    {
        Task<QnA> GetQuestionList(int ExamID);
        Task<IQueryable<TEntity>> SearchQuestion(Expression<Func<TEntity, bool>> search = null);
        Task<int> AddQuestion(TEntity entity);
        Task<int> UpdateQuestion(TEntity entity);
        Task<int> DeleteQuestion(TEntity entity);
    }
}
