import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {
  ApiUrlContext,
  DaftarPerahuContext,
  HeaderMessageContext,
} from "../../App";
import { useContext } from "react";

function JualModal({ show, handleClose, perahu }) {
  const apiUrl = useContext(ApiUrlContext);
  const { daftarPerahu, setDaftarPerahu } = useContext(DaftarPerahuContext);
  const { headerMessage, setHeaderMessage } = useContext(HeaderMessageContext);

  const jualPerahu = async () => {
    try {
      const res = await fetch(`${apiUrl}/perahu/${perahu.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
      });
      const data = await res.json();
      if (data.status === "FAILED") throw new Error(data.message);
      setDaftarPerahu(daftarPerahu.filter((item) => item.id !== perahu.id));
      handleClose();
      setHeaderMessage({ ...headerMessage, show: true, message: data.message });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Jual Perahu</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-break">
        Apakah anda yakin ingin menjual {perahu.name}?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Batalkan
        </Button>
        <Button variant="danger" onClick={jualPerahu}>
          Jual
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default JualModal;
