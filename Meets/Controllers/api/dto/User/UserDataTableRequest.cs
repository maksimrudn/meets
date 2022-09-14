using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Meets.Controllers.api.dto.User
{
    public class UserDataTableRequest
    {
        [Range(1, ulong.MaxValue, ErrorMessage = "{0} не может быть равен 0")]
        public ulong userId { get; set; }

        /// <summary>
        /// Включить в массив событий, те события, которые пользователь организует
        /// </summary>
        public bool organizes { get; set; }

        /// <summary>
        /// Включить в массив событий, те события, на которые пользователь идёт
        /// </summary>
        public bool goes { get; set; }

        /// <summary>
        /// Включить в массив событий, прошедшие события
        /// </summary>
        public bool past { get; set; }

        /// <summary>
        /// страница которая будет отрисована
        /// </summary>
        public int draw { get; set; }

        /// <summary>
        /// количество пропускаемых событий
        /// </summary>
        public int start { get; set; }

        /// <summary>
        /// количесво строк таблицы
        /// </summary>
        public int length { get; set; }

        /// <summary>
        /// поиск
        /// </summary>
        public search search { get; set; }

        /// <summary>
        /// колонки таблицы (сортироовка, название)
        /// </summary>
        public List<column> columns { get; set; }

        /// <summary>
        /// объект сортировки для колонки
        /// </summary>
        public List<order> order { get; set; }

    }
}
