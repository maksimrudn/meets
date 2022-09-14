import AppConfig from "./AppConfig";


export const formToObject = (htmlForm) => {
    let formData = new FormData(htmlForm);
    let dto = Object.fromEntries(formData.entries());
    
    return dto;
}

export const formDataToObject = (formData) => {
    var object = {};
    formData.forEach(function (value, key) {
        object[key] = value;
    });

    return object;
}

export const objectToFormData = (obj) => {
    var form_data = new FormData();

    for (var key in obj) {
        form_data.append(key, obj[key]);
    }

    return form_data;
}


/**
 * Фильтрует список файлов по маске разрешённых имен и типов
 * @param {any} files список файлов, полученных из input.currentTarget.files
 * */
export const getAllowedPhotoFilesByMask = (files) => {
    let regex = AppConfig.PhotoNameRegex;

    var res = [];
    if (files) {
        for (let i = 0; i < files.length; i++) {
            if (regex.test(files[i].name.toLowerCase())) {
                res.push(files[i]);
            }
        }
    }

    return res;
}

/**
 * Возвращает коллекцию с контентом фото файлов. Эту коллекцию можно загрузить в img src=...
 * @param {any} files список файлов, полученных из input.currentTarget.files, может быть отфильтрован
 */
export const loadPhotoContentFromFiles = async (files) => {

    let contentList = [];

    if (files) {
        for (let i = 0; i < files.length; i++) {
            contentList.push(await readFile(files[i]));
        }
    }

    return contentList;
}

function readFile(file) {
    return new Promise((resolve, reject) => {
        let fr = new FileReader();
        fr.onload = x => resolve(fr.result);
        fr.readAsDataURL(file) // or readAsText(file) to get raw content
    })
}

/**
 * Проверяет является ли строка JSON или нет
 * @param {any} str
 */
export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/**
 * Парсит описание события
 * @param {any} str
 */
export function decodeDescription(description) {
    var res = '';

    // Ситуация 1. Строка преобразована в escape коды и закодирована в base64
    if (res === '') {
        try {
            res = unescape(atob(description));
        } catch {
        }
    }

    // Ситуация 2. Строка закодирована только в base64
    if (res === '') {
        try {
            res = atob(description);
        } catch {
        }
    }

    

    // Ситуация 3. Если не отработаны первые 2 ситуации, то подразумевается что описание хранится обычным текстом.
    if (res === '') {
        res = description;
    }

    return res;
}

/**
 * Преобразует строку описания в формат, доступный для передачи через json
 * Входящая строка приходит от редактора tinyMCE
 * @param {any} str
 */
export function encodeDescription(description) {
    var res = '';

    res = btoa(escape(description));

    return res;
}

export function getAvatarPathForUser(user) {
    var res = AppConfig.DefaultAvatar;

    if (user.avatar)
        res = 'content/users/' + user.id + '/' + user.avatar;

    return res
}

/**
 * получает путь для event картинки из папки Content
 * @param {any} evId - id события
 * @param {any} img - example: (000001.png)
 */
export function getImagePathForEvent(evId, img) {
    return `Content/events/${evId}/${img}`;
}


