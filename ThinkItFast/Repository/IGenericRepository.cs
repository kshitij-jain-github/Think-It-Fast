using System.Linq.Expressions;

namespace ThinkItFast.Repository
{
    public interface IGenericRepository<T> :IDisposable
    {
        IEnumerable<T> GetAll(Expression<Func<T, bool>> filter = null,
            Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null);
        T GetById(object Id);
        Task<T> GetByIdAsync(object Id);
        void Add(T entity);
        Task<T> AddAsync(T entity);
        void DeleteById(object Id);
        void Delete(T entity);
        Task<T> DeleteAsync(T entity);  
        void Update(T entity);
        Task<T> UpdateAsync(T entity);

    }
}
