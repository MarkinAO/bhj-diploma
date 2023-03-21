/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = options.responseType || 'json'

    try {
        xhr.open(options?.method, options?.url)
        if(options?.method === 'GET') {
            let dataURL = '?';
            for(let key in options.data) {
                dataURL += `${key}=${options.data[key]}&`;
            }
            options.url += dataURL.slice(0, -1);
            xhr.send()
        } else {
            const formData = new FormData()
            for (const key in options?.data) {
                formData.append(key, options?.data[key])
            }
            xhr.send(formData)
        }         
    } catch {
        throw new Error(xhr.error)
    }    

    xhr.addEventListener('load', () => {
        if(xhr.readyState === xhr.DONE) {
            options?.callback(null, xhr.response)
        }
    })
    xhr.addEventListener('error', () => {
        options?.callback(xhr.error)
    })
}