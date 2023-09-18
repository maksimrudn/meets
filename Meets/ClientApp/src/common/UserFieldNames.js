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
        case UserFieldNames.FullName: return 'Name';
        case UserFieldNames.BirthDate: return 'Birth date';
        case UserFieldNames.City: return 'City';
        case UserFieldNames.Description: return 'Description';
        case UserFieldNames.Growth: return 'Height';
        case UserFieldNames.Weight: return 'Weight';
        case UserFieldNames.Tags: return 'Tags';
    }
}