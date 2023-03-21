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
           
        while (accountsSelect.firstChild) {
          accountsSelect.removeChild(accountsSelect.firstChild)
        }

        response.data.forEach(el => {
          const newElementList = `<option value="${el.id}">${el.name}</option>`
          accountsSelect.insertAdjacentHTML('beforeend', newElementList)
        })
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
    const formName = data.type === 'income' ? 'Income' : 'Expense'

    Transaction.create(data, (err, response) => {
      if(response && response.success) {        
        App.getModal('new' + formName).close()
        App.update()
        this.element.reset()
      } else {
        console.error(response.error)
      }      
    })  
  }
}