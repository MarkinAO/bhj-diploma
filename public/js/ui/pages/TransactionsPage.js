/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error('Передан не верный элемент (TransactionsPage)')
    }
    this.element = element
    this.lastOptions = null
    this.registerEvents()
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if(this.lastOptions) {
      this.render(this.lastOptions)
    }    
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      e.preventDefault()
      if(e.target.classList.contains('remove-account')) {
        this.removeAccount()
      }
      if(e.target.classList.contains('transaction__remove')) {
        this.removeTransaction(e.target.dataSet.id)
      }
    })
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {    
    if(this.lastOptions) {
      if(confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove(this.lastOptions, (err, response) => {
          if(response.success) {
            App.updateWidgets()
            App.updateForms()
          } else {
            console.error(response.error)
          }
        })
      }      
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({id}, (err, response) => {
        if(response.success) {
          App.update()
        } else {
          console.error(response.error)
        }
      })
    }    
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
      this.lastOptions = options

      Account.get(this.lastOptions, (err, response) => {
        if(response.success) {
          this.renderTitle(response.data.name)
        }
      })

      Transaction.list(this.lastOptions, (err, response) => {
        if (response.success) {
          this.renderTransactions(response.data)
        } else {
          console.error(response.error)
        }
      })
    }   
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([])
    this.renderTitle('Название счёта')
    this.lastOptions = null
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').textContent = name
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }

    return new Date(date).toLocaleString('ru', options)
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    const transactionType = item.type === 'income' ? 'transaction_income' : 'transaction_expense'    

    const newTransaction = 
    `<div class="transaction ${transactionType} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>              
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">          
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">           
            <button class="btn btn-danger transaction__remove" data-id="${item.id}">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>`
    
    return newTransaction
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const content = document.querySelector('.content')    
    data.forEach(el => {      
      content.insertAdjacentHTML('beforeend', this.getTransactionHTML(el))
    })
  }
}