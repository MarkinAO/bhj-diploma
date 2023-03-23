/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {  
  static URL = '/account'
  /**
   * Получает информацию о счёте
   * */
  static get(id = '', callback){
    createRequest({
      id: id,
      callback,
      url: this.URL + '/' + id.account_id,
      method: 'GET'
    })
  }
}
