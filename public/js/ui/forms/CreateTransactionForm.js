/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList()
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list({}, (err, response) => {
      if(response && response.success) {
        const accountsSelect = this.element.querySelector('.accounts-select')        
        accountsSelect.innerHTML = response.data.reduce((acc, el) => acc + `<option value="${el.id}">${el.name}</option>`, '')
      }        
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    const formName = data.type === 'income' ? 'newIncome' : 'newExpense'    
        
    data.name = {
      'name': data.name,
      'old_time': data.old_time ? data.old_time : null
    }
    data.name = JSON.stringify(data.name)
    
    Transaction.create(data, (err, response) => {
      if(response && response.success) {
        App.getModal(formName).close()
        App.update()
        this.element.reset()

        if(data.old_time) {
            // Для редактирования транзакций: удаляем старую транзакцию
            App.pages.transactions.removeTransaction(data.transaction_id, true)
                  
            // Устанавливаем в формах значения по умолчанию
            const modalName = formName === 'newIncome' ? 'newIncome' : 'newExpense'
            App.getModal(modalName).element.querySelector('.btn-primary').textContent = 'Создать'
            App.getModal(modalName).element.querySelector('.modal-title').textContent = formName === 'newIncome' ? 'Новый доход' : 'Новый расход'
            const form = document.forms[data.type + 'Form']
            // form.name.removeAttribute('readonly')
            form.account_id.removeAttribute('disabled')
            form.removeAttribute('data-old-time')
            form.removeAttribute('data-id')
            form.removeAttribute('data-time')
        }      
      } else {
        console.error(response.error)
      }      
    })  
  }
} 