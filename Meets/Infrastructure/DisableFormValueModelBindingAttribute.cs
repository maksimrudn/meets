using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace Meets.Infrastructure
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public sealed class DisableFormValueModelBindingAttribute : Attribute, IResourceFilter
    {
        public void OnResourceExecuting(ResourceExecutingContext context)
        {
            context.ValueProviderFactories.Clear();
        }

        public void OnResourceExecuted(ResourceExecutedContext context)
        {

        }
    }
}
