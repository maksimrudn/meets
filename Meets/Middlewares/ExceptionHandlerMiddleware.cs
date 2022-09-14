
using Meets.Controllers.api.dto.Error;
using Meets.Exceptions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace Meets.Middlewares
{
    public class ExceptionHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception error)
            {
                var response = new ErrorResponse();

                context.Response.ContentType = "application/json";

                switch (error)
                {
                    case ChangePasswordException ex:

                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        response.errors = ex.Result.Errors.Select(x => new Error(x.Code, x.Description));
                        break;

                    case ModelValidationException ex:

                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        response.errors = ex.ModelState.Values.SelectMany(x =>
                        {
                            return x.Errors.Select(y =>
                            {
                                return new Error("", y.ErrorMessage);
                            });
                        });
                        break;

                    case RegistrationException ex:

                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        response.errors = ex.Errors.Select(x => new Error("", x));
                        break;

                    case Exception ex:
                        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                        response.errors = new List<Error>() {
                            new Error(StatusCodes.Status500InternalServerError.ToString(), ex.Message )
                        };
                        break;
                }

                var result = JsonConvert.SerializeObject(response);

                await context.Response.WriteAsync(result);
            }
        }
    }
}
