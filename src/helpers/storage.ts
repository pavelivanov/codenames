const ffErrors = [
  'NS_ERROR_FAILURE', // has max size
  'NS_ERROR_FILE_CORRUPTED', // is crashed
  'NS_ERROR_FILE_NO_DEVICE_SPACE',
]

class MemoryStorage implements Storage {
  private storage = new Map<string, string | null>()

  get length(): number {
    return this.storage.size
  }

  key(index: number): string | null {
    return this.storage.keys()[index] || null
  }

  getItem(key: string): string | null {
    if (this.storage.has(key)) {
      return this.storage.get(key)
    }

    return null
  }

  setItem(key: string, value: string) {
    this.storage.set(key, value)
  }

  removeItem(key: string) {
    this.storage.delete(key)
  }

  clear(): void {
    this.storage.clear()
  }
}

class LocalStorage {
  readonly memoryLocalStorage: MemoryStorage
  readonly memorySessionStorage: MemoryStorage

  constructor() {
    if (!LocalStorage.isSupported(() => localStorage)) {
      this.memoryLocalStorage = new MemoryStorage()
    }

    if (!LocalStorage.isSupported(() => sessionStorage)) {
      this.memorySessionStorage = new MemoryStorage()
    }
  }

  // we should check it like this, to avoid "Operation Insecure" errors
  // add replace it with MemoryStorage
  private static isSupported(getStorage: () => Storage) {
    try {
      const testKey = '__some_random_key_you_are_not_going_to_use__'
      getStorage().setItem(testKey, testKey)
      getStorage().removeItem(testKey)
      return true
    }
    catch (error) {
      return false
    }
  }

  private getLocalStorage(): Storage {
    return this.memoryLocalStorage || localStorage
  }

  private getSessionStorage(): Storage {
    return this.memorySessionStorage || sessionStorage
  }

  private get<T = any>(name: string, storage: Storage): T {
    try {
      return JSON.parse(storage.getItem(name))
    }
    catch (err) {
      if (ffErrors.includes(err.name)) {
        this.clear(storage)

        return null
      }

      console.warn(err, {
        extra: {
          name,
        },
      })

      this.remove(name, storage) // remove invalid data

      return null
    }
  }

  private set<T = any>(name: string, value: T, storage: Storage) {
    try {
      storage.setItem(name, JSON.stringify(value))
    }
    catch (err) {
      console.warn(err, {
        extra: {
          name,
          value,
        },
      })

      if (ffErrors.includes(err.name)) {
        this.clear(storage)
      }
    }
  }

  private remove(name: string, storage: Storage) {
    try {
      storage.removeItem(name)
    }
    catch (err) {
      console.warn(err, {
        extra: {
          name,
        },
      })
    }
  }

  // to show error alert only once
  private corruptedAlertWasShowed = false

  private clear(storage: Storage) {
    // Firefox corrupted file error, try to clean up the storage, and ignore error
    // https://stackoverflow.com/questions/18877643/error-in-local-storage-ns-error-file-corrupted-firefox
    try {
      console.info(`clean up storage`)

      storage.clear()
    }
    catch (error) {
      if (ffErrors.includes(error.name) && !this.corruptedAlertWasShowed) {
        alert('Sorry, it looks like your browser storage has been corrupted. '
          + 'Please clear your storage by going to Tools -> Clear Recent History -> Cookies and set time range to \'Everything\'. '
          + 'This will remove the corrupted browser storage across all sites.'
        )

        this.corruptedAlertWasShowed = true
      }

      console.info(error)
    }
  }

  private keys(storage: Storage): string[] {
    const length = storage.length
    const result = []

    for (let i = 0; i < length; i++) {
      result.push(storage.key(i))
    }

    return result
  }

  // localStorage
  public getItem<T = any>(name: string): T {
    return this.get<T>(name, this.getLocalStorage())
  }

  public setItem<T = any>(name: string, value: T) {
    this.set<T>(name, value, this.getLocalStorage())
  }

  public removeItem(name: string) {
    this.remove(name, this.getLocalStorage())
  }

  public getKeys(): string[] {
    return this.keys(this.getLocalStorage())
  }

  // session storage
  public getSessionItem<T = any>(name: string): T {
    return this.get(name, this.getSessionStorage())
  }

  public setSessionItem<T = any>(name: string, value: T) {
    this.set(name, value, this.getSessionStorage())
  }

  public removeSessionItem(name: string) {
    this.remove(name, this.getSessionStorage())
  }

  public getSessionKeys(): string[] {
    return this.keys(this.getSessionStorage())
  }
}


export default new LocalStorage()
