/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = options.responseType || 'json'
    const formData = new FormData()

    if(options?.method === 'GET') {
        let dataURL = '?';
        for(let key in options.data) {
            dataURL += `${key}=${options.data[key]}&`
        }
        options.url += dataURL.slice(0, -1)
    } else {        
        for (const key in options?.data) {
            formData.append(key, options?.data[key])
        }        
    }

    try {        
        xhr.open(options?.method, options?.url)
        xhr.send(formData)        
    } catch(err) {
        throw new Error(err)
    }    

    xhr.addEventListener('load', () => {
        options?.callback(null, xhr.response)
    })
    xhr.addEventListener('error', () => {
        options?.callback(xhr.error)
    })
}