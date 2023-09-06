using ThinkItFast.Models;
using ThinkItFast.Repository.Base;
using ThinkItFast.Repository.Interfaces;

namespace ThinkItFast.Extensions
{
    public static class ServiceCollectionExtension
    {

        public static IServiceCollection AddServices(this IServiceCollection services)
        {
            return services
           .AddScoped<ICandidate<Candidate>, CandidateService<Candidate>>()
           .AddScoped<IExam<Exam>, ExamService<Exam>>()
           .AddScoped<IQuestion<Question>, QuestionService<Question>>()
           .AddScoped<IResult<Result>, ResultService<Result>>();

        }
    }
}
