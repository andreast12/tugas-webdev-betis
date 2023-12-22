import { useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  ApiUrlContext,
  DaftarPerahuContext,
  HeaderMessageContext,
} from "../../App";
import { Alert } from "react-bootstrap";
import { BeliEditModalContext } from "./BeliEditModalContextProvider";

function BeliEditModal() {
  const apiUrl = useContext(ApiUrlContext);
  const { daftarPerahu, setDaftarPerahu } = useContext(DaftarPerahuContext);
  const { beliEditModal, setBeliEditModal, closeBeliEditModal, daftarWarna } =
    useContext(BeliEditModalContext);
  const { headerMessage, setHeaderMessage } = useContext(HeaderMessageContext);

  /**
   * Menjalankan request beli atau edit perahu ketika form modal disubmit
   */
  const formSubmit = async () => {
    if (beliEditModal.mode === "BELI") {
      // Beli perahu
      try {
        const res = await fetch(`${apiUrl}/perahu`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: beliEditModal.perahu.name,
            description: beliEditModal.perahu.description,
            capacity: parseFloat(beliEditModal.perahu.capacity),
            color: beliEditModal.perahu.color,
          }),
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);

        setDaftarPerahu([...daftarPerahu, data.perahu]);
        closeBeliEditModal();
        setHeaderMessage({
          ...headerMessage,
          show: true,
          message: data.message,
        });
      } catch (error) {
        setBeliEditModal({
          ...beliEditModal,
          warning: {
            show: true,
            message: error.message,
          },
        });
      }
    } else {
      // Edit perahu
      try {
        const res = await fetch(`${apiUrl}/perahu/${beliEditModal.perahu.id}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: beliEditModal.perahu.name,
            description: beliEditModal.perahu.description,
            capacity: parseFloat(beliEditModal.perahu.capacity),
            color: beliEditModal.perahu.color,
          }),
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);

        const now = new Date().toLocaleString();
        setDaftarPerahu(
          daftarPerahu.map((item) =>
            item.id === beliEditModal.perahu.id
              ? {
                  ...item,
                  ...beliEditModal.perahu,
                  updated_at: now,
                }
              : item
          )
        );
        closeBeliEditModal();
        setHeaderMessage({
          ...headerMessage,
          show: true,
          message: data.message,
        });
      } catch (error) {
        setBeliEditModal({
          ...beliEditModal,
          warning: {
            show: true,
            message: error.message,
          },
        });
      }
    }
  };

  return (
    <Modal show={beliEditModal.show} onHide={closeBeliEditModal}>
      <Modal.Header closeButton>
        <Modal.Title>
          {beliEditModal.mode === "BELI" ? "Beli Perahu" : "Edit Perahu"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {beliEditModal.warning.show ? (
          <Alert variant="warning">{beliEditModal.warning.message}</Alert>
        ) : (
          ""
        )}
        <Form>
          <Form.Group className="mb-3" controlId="formPerahuName">
            <Form.Label>Nama perahu</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={beliEditModal.perahu.name}
              onChange={(e) =>
                setBeliEditModal({
                  ...beliEditModal,
                  perahu: {
                    ...beliEditModal.perahu,
                    name: e.target.value,
                  },
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPerahuDescription">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={beliEditModal.perahu.description}
              onChange={(e) =>
                setBeliEditModal({
                  ...beliEditModal,
                  perahu: {
                    ...beliEditModal.perahu,
                    description: e.target.value,
                  },
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPerahuCapacity">
            <Form.Label>Kapasitas</Form.Label>
            <Form.Control
              type="number"
              value={beliEditModal.perahu.capacity}
              onChange={(e) =>
                setBeliEditModal({
                  ...beliEditModal,
                  perahu: {
                    ...beliEditModal.perahu,
                    capacity: e.target.value,
                  },
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPerahuColor">
            <Form.Label>Warna</Form.Label>
            <Form.Select
              aria-label="Pilih warna"
              value={beliEditModal.perahu.color}
              onChange={(e) =>
                setBeliEditModal({
                  ...beliEditModal,
                  perahu: {
                    ...beliEditModal.perahu,
                    color: e.target.value,
                  },
                })
              }
            >
              {daftarWarna.map((warna, index) => (
                <option key={index} value={warna}>
                  {warna}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeBeliEditModal}>
          Batalkan
        </Button>
        <Button variant="primary" onClick={formSubmit}>
          {beliEditModal.mode === "BELI" ? "Beli" : "Edit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default BeliEditModal;
