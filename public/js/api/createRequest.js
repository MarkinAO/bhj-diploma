/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest
    xhr.responseType = 'json'

    try {
        xhr.open(options?.method, options?.url)
        if(options?.method === 'GET') {            
            xhr.send()
        } else {
            const formData = new FormData
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
};
