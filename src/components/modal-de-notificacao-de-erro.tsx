import { ReactNode } from "react";
import { Modal } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";

interface ModalDeNotificacaoDeErroProps
{
  children: ReactNode
}

export function ModalDeNotificacaoDeErro ({
  children
}: ModalDeNotificacaoDeErroProps)
{
return (
  <Modal show={true} centered>
    <Modal.Body>
      <div className="d-flex gap-3 justify-content-center">
        <div>
          <FaExclamationCircle className="fs-1 text-danger"/> 
        </div>
        <div>
          <span className="fs-4">{children}</span>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  )
}