/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, respone) => {
      const erroreMessage = document.querySelector('.errore-message_register')
      erroreMessage.textContent = ''
      if(respone.success) {
        App.setState( 'user-logged' )
        App.getModal("register").close()        
      } else {
        console.error(respone.error)
        erroreMessage.textContent = 'Пользователь с таким email-адресом уже зарегистрирован'
      }
    })
  }
}