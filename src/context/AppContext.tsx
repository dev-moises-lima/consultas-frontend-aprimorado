import { createContext, ReactNode, useState } from "react"

const appContextDefaultValue = {
  mensagemDeErroFatal: "",
  mudarMensagemDeErroFatal: (novaMensagemDeErroFatal: string) => {console.log(novaMensagemDeErroFatal)}
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