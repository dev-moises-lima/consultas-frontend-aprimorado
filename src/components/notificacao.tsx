import { ReactNode } from "react"
import { Alert } from "react-bootstrap"

interface NotificacaoProps {
  children: ReactNode
  onClose: () => void
  variante: "erro" | "sucesso"
}

export function Notificacao({
  children,
  variante,
  onClose
} : NotificacaoProps) {
  
  return (
    <Alert
      variant={variante === "sucesso" ? "success" : "danger"}
      onClose={onClose}
      dismissible
    >
      <span className="px-1">{children}</span>
    </Alert>
  )
}