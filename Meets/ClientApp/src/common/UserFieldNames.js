/**
 * enum с полями для UserEditorModal модалки в UserCard
 * */
export const UserFieldNames = {
    Photo: 'photo',
    FullName: 'fullName',
    BirthDate: 'birthDate',
    City: 'city',
    Description: 'description',
    Growth: 'growth',
    Weight: 'weight',
    Tags: 'tags'
}


/**
 * функция возвращает Title для UserEditorModal модалки в UserCard
 * */
export function getUserEditorModalTitle(fieldName) {
    switch (fieldName) {
        case UserFieldNames.FullName: return 'Имя';
        case UserFieldNames.BirthDate: return 'Дата рождения';
        case UserFieldNames.City: return 'Город';
        case UserFieldNames.Description: return 'О себе';
        case UserFieldNames.Growth: return 'Рост';
        case UserFieldNames.Weight: return 'Вес';
        case UserFieldNames.Tags: return 'Тэги';
    }
}