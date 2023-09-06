using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ThinkItFast.Controllers
{
    public class BasicAuthentication : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            string value = Convert.ToString(context.HttpContext.Session.GetString("AuthenticatedUser"));
            if (ReferenceEquals(value, null))
            {
                context.Result = new RedirectToRouteResult(new RouteValueDictionary { { "Controller", "Account" }, { "Action", "Login" } });
            }
        }
    }
}
