using System.Linq.Expressions;

namespace ThinkItFast.Repository.Interfaces
{
    public interface ICandidate<TEntity>
    {
        Task<IEnumerable<TEntity>> GetCandidateList();
        Task<TEntity> GetCandidate(int id);
        Task<IQueryable<TEntity>> SearchCandidate(Expression<Func<TEntity, bool>> search = null);
        Task<int> AddCandidate(TEntity entity);
        Task<int> UpdateCandidate(TEntity entity);
        Task<int> DeleteCandidate(TEntity entity);

    }
}
