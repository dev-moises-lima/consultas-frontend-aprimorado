import { createContext, ReactNode, useState } from "react"

const appContextDefaultValue = {
  mensagemDeErroFatal: "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mudarMensagemDeErroFatal: (_novaMensagemDeErroFatal: string) => {}
}

export const AppContext = createContext(appContextDefaultValue)

interface AppProviderProps{
  children: ReactNode
}

export function AppProvider({
  children,
}: AppProviderProps) {
  const [mensagemDeErroFatal, setMensagemDeErroFatal] = useState("")

  function mudarMensagemDeErroFatal(novaMensagemDeErroFatal: string) {
    setMensagemDeErroFatal(novaMensagemDeErroFatal)
  }

  return (
    <AppContext.Provider value={{mensagemDeErroFatal, mudarMensagemDeErroFatal}}>
      {children}
    </AppContext.Provider>
  )
}