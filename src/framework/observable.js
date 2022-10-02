/**
 * Класс, реализующий паттерн Наблюдатель.
 * Доработан необязательным параметром "группа наблюдателей" для возможности подписки на обновления разных видоа данных одного объекта
 */
export default class Observable {
  /** @type {Set<сallback, group>} Множество функций типа observerCallback */
  #observers = new Set();

  /**
   * Метод, позволяющий подписаться на событие
   * @param {observerCallback} observer Функция, которая будет вызвана при наступлении события
   */
  addObserver(callback, group = null) {
    this.#observers.add({callback, group});
  }

  /**
   * Метод, позволяющий отписаться от события
   * @param {observerCallback} observer Функция, которую больше не нужно вызывать при наступлении события
   */
  removeObserver(callback, group = null) {
    this.#observers.delete({callback, group});
  }

  /**
   * Метод для оповещения подписчиков о наступлении события
   * @param {*} event       Тип события
   * @param {*} id          Идентификатор обновления
   * @param {*} payload     Дополнительная информация
   * @param {*} updateGroup Группа наблюдателей, для которой актуально обновление
   */
  _notify(event, id, payload, updateGroup = null) {
    this.#observers
      .forEach(({callback,group}) => {
        if (group === updateGroup) {
          callback(event, id, payload);
        }
      });
  }
}

/**
 * Функция, которая будет вызвана при наступлении события
 * @callback observerCallback
 * @param {*} event     Тип события
 * @param {*} id        Идентификатор обновления
 * @param {*} [payload] Дополнительная информация
 * @param {*} group     Группа наблюдателей (не обязательное)
 */
