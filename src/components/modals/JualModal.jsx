import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { ApiUrlContext, DaftarPerahuContext } from "../../App";
import { useContext } from "react";

function JualModal({ show, handleClose, perahuId, perahuName }) {
  const apiUrl = useContext(ApiUrlContext);
  const { daftarPerahu, setDaftarPerahu } = useContext(DaftarPerahuContext);

  const jualPerahu = async () => {
    try {
      const res = await fetch(`${apiUrl}/perahu/${perahuId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
      });
      const data = await res.json();
      if (data.status === "FAILED") throw new Error(data.message);
      setDaftarPerahu(daftarPerahu.filter((perahu) => perahu.id !== perahuId));
      handleClose();
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
        Apakah anda yakin ingin menjual {perahuName}?
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
