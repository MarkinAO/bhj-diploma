/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.login(data, (err, respone) => {
      const erroreMessage = document.querySelector('.errore-message_login')
      erroreMessage.textContent = ''
      if(respone.success) {        
        App.setState( 'user-logged' )
        App.getModal("login").close()
      } else {
        console.error(respone.error)
        erroreMessage.textContent = 'Введён неверный логин или пароль'
      }
    })
  }
}