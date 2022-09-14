using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;

namespace Meets.Exceptions
{
    /// <summary>
    /// Исключение при ошибке проверки данных модели DTO. Определяется требованиями к данным в настройках самих моделей DTO
    /// </summary>
    public class ModelValidationException: Exception
    {
        public ModelValidationException(ModelStateDictionary modelState)
        {
            ModelState = modelState;
        }   

        public ModelStateDictionary ModelState { get; set; }
    }

    // по умолчанию JSON выгляти так
    // {"type":"https://tools.ietf.org/html/rfc7231#section-6.5.1","title":"One or more validation errors occurred.","status":400,"traceId":"00-f970174727b293afbc31c655365863dc-dc9fa1c94c72c70c-00","errors":{"BirthDate":["The value 'Invalid date' is not valid for Дата рождения."]}}
}
