class LocalStorage {
  storage = window.localStorage
  error = {
    key: 'key is falsey or not a string',
    put: 'obj is falsey, empty, or not an object',
    local_storage_disabled: `Your local storage is not available on your browser. We store data about the missions and tasks you are on in your browser so we can save costs and allow this game to be free-to-play.`,
  }

  constructor() {
    // test for local storage avaliablity. Alert the user if it is not avaliable. 
    // source: https://stackoverflow.com/a/16427725/15034002
    if (typeof window.localStorage !== 'undefined' || window.localStorage !== null) {
      try {
        window.localStorage.setItem('feature_test', 'yes');
        if (window.localStorage.getItem('feature_test') === 'yes') {
          window.localStorage.removeItem('feature_test');
          // localStorage is enabled!
          this.storage = window.localStorage
        } else {
          // localStorage is disabled
          alert(this.error.local_storage_disabled)
        }
      } catch (e) {
        // localStorage is disabled
        alert(this.error.local_storage_disabled)
      }
    } else {
      // localStorage is not available
      alert(this.error.local_storage_disabled)
    }
  }

  /**
   * Sets an item in local storage using key/value pairs. 
   * @param {string} key string - key to access data in local storage
   * @param {*} value any - data stored in storage
   */
  set(key, value) {
    if (!key || typeof key !== 'string') throw this.error.key
    this.storage.setItem(key, JSON.stringify(value))
  }

  /**
   * spreads an object into local storage
   * @param {object} obj object with at least one key value pair
   */
  put(obj) {
    if (!obj || typeof obj !== 'object' || Object.keys(obj).length < 1) throw this.error.put;
    for (const [key, value] of Object.entries(obj)) {
      this.storage.setItem(key, JSON.stringify(value))
    }
  }

  /**
   * Appends data from input object to an object that already exists in local storage
   * @param {string} key key to accexx data in local storage
   * @param {object} obj data that will be appended
   */
  addOnObject(key, obj) {
    const item = this._handleAddOnGetItem(key, obj, 'object')
    item && this.set(key, { ...item, ...obj })
  }

  /**
   * Appends data from input array to an array that already exists in local storage
   * @param {string} key key to access data in local storage
   * @param {array} arr data that will be appended
   */
  addOnArray(key, arr) {
    const item = this._handleAddOnGetItem(key, arr, 'array')
    item && this.set(key, [...item, ...arr])
  }

  /**
   * private function to help with appending to object or array
   * @param {string} key key to look up stored item
   * @param {object} obj data to be stored in local storage
   * @param {string} obj_type array or object 
   * @returns void
   */
  _handleAddOnGetItem(key, obj, obj_type) {
    if (!key || typeof key !== 'string') throw this.error.key
    if (!obj || typeof obj !== 'object' || Object.keys(obj).length < 1)
      throw this.error.put;

    let item = this.storage.getItem(key)

    if (item === null) {
      item = obj_type === 'array' ? [] : {}
    }
    if (typeof item === 'string') {
      item = JSON.parse(item)
    }

    if (!item || typeof item !== 'object') throw this.error.put;
    return item
  }

  /**
   * gets item from local storage using a given key
   * @param {string} key string - used to get data from local storage
   * @returns JSON parsed data
   */
  get(key) {
    if (!key || typeof key !== 'string') throw this.error.key
    return JSON.parse(this.storage.getItem(key))
  }

  /**
   * get all data from the local storage. JSON parse and return
   * @returns all of local storage
   */
  getAll() {
    const obj = {}
    for (const [key, value] of Object.entries(this.storage)) {
      obj[key] = JSON.parse(value)
    }
    return obj
  }

  /**
   * Removes the key/value pair if it exisits 
   * @param {string} key string
   */
  delete(key) {
    if (!key || typeof key !== 'string') throw this.error.key
    this.storage.removeItem(key)
  }

  /**
   * Completely empties local storage
   */
  clear = () => {
    this.storage.clear()
  }

  // ------------------- Spesific use cases -------------------------

  /**
   * Use this function whenever updating the user. It will update the user you want
   * and update the current user if they are the same. 
   * @param {object} user user object
   */
  updateUserData(user) {
    this.addOnObject('users', { [user.agent_name]: user })
    // update the current user the smame time we update the user, 
    // if the names are the same (names are unique)
    const current_user = this.get('current_user')
    if (current_user.agent_name === user.agent_name) {
      this.set('current_user', user)
    }
  }

  /**
   * returns the current user as stored in local storage
   * @returns 
   */
  getCurrentUser() {
    const current_user_id = this.get('current_user')
    return this.get('users')[current_user_id]
  }

  /**
   * returns the gloabaly (litteraly) unique user ID, which is a combo of the user
   * agent_name and device ID. Ex: "935208e6-3cb8-47ed-b9a8-e717a4b9abe3/Agent 731"
   * @param {object} user user object
   * @returns string
   */
  getUserUniqueID(user) {
    const device_id = this.get('device_id')
    const { agent_name } = user
    return `${device_id}/${agent_name}`
  }

}

export default new LocalStorage()