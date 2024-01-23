import { showStartInfo, checkDatabase, syncDatabase } from './utils/start'

showStartInfo()

await checkDatabase()
await syncDatabase()
