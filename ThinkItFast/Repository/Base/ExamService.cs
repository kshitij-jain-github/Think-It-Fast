using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using ThinkItFast.Models;

namespace ThinkItFast.Repository.Base
{
    public class ExamService<TEntity> : IExam<TEntity> where TEntity : BaseEntity
    {
        private readonly AppDbContext _dbContext;
        private DbSet<TEntity> _dbSet;
        public ExamService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
            _dbSet = dbContext.Set<TEntity>();
        }
        public async Task<IEnumerable<TEntity>> GetExamList()
        {
            return await _dbSet.ToListAsync();
        }
        public async Task<TEntity> GetExam(int id)
        {
            return await _dbSet.FindAsync(id);
        }
        public async Task<IQueryable<TEntity>> SearchExam(Expression<Func<TEntity, bool>> search = null)
        {
            IQueryable<TEntity> query = _dbSet;
            if (search != null)
            {
                query = query.Where(search);
            }
            return query;
        }

        public async Task<int> AddExam(TEntity entity)
        {
            int output = 0;
            _dbSet.Add(entity);
            output = await _dbContext.SaveChangesAsync();
            return output;
        }

        public async Task<int> UpdateExam(TEntity entity)
        {
            int output = 0;
            _dbSet.Update(entity);
            output = await _dbContext.SaveChangesAsync();
            return output;
        }
        public async Task<int> DeleteExam(TEntity entity)
        {
            int output = 0;
            _dbSet.Remove(entity);
            output = await _dbContext.SaveChangesAsync();
            return output;
        }

    }
}
