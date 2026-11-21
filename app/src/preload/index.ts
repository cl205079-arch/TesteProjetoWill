import { contextBridge } from 'electron'

export interface BibliotecaApi {
  readonly apiUrl: string
}

const prefixo = '--biblioteca-api-url='
const argumento = process.argv.find((valor) => valor.startsWith(prefixo))
const apiUrl = argumento?.slice(prefixo.length) ?? 'http://localhost:3000/api'

const api: BibliotecaApi = { apiUrl }

contextBridge.exposeInMainWorld('biblioteca', api)
