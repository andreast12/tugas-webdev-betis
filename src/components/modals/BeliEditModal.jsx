import { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  ApiUrlContext,
  DaftarPerahuContext,
  BeliEditModalContext,
} from "../../App";
import { Alert } from "react-bootstrap";

function BeliEditModal({ handleClose }) {
  const apiUrl = useContext(ApiUrlContext);
  const { daftarPerahu, setDaftarPerahu } = useContext(DaftarPerahuContext);
  const { beliEditModal } = useContext(BeliEditModalContext);

  const [daftarWarna, setDaftarWarna] = useState([]);
  const [perahu, setPerahu] = useState({
    name: "",
    description: "",
    capacity: "0",
    color: "",
  });
  const [warning, setWarning] = useState({
    show: false,
    message: "",
  });

  // Mem-fetch daftar warna ketika page load
  useEffect(() => {
    const getDaftarWarna = async () => {
      const res = await fetch(`${apiUrl}/perahu/warna`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
      });
      const data = await res.json();
      setDaftarWarna(data.daftarWarna);
    };

    getDaftarWarna();
  }, []);

  // Akan ke-trigger setiap kali modal ditampilkan atau ditutup
  useEffect(() => {
    const getPerahuById = async (id) => {
      try {
        const res = await fetch(`${apiUrl}/perahu/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          },
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);
        setPerahu({
          name: data.perahu.name,
          description: data.perahu.description,
          capacity: data.perahu.capacity,
          color: data.perahu.color,
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    if (beliEditModal.mode === "BELI")
      setPerahu({
        name: "",
        description: "",
        capacity: "0",
        color: daftarWarna[0],
      });
    else getPerahuById(beliEditModal.perahuId);

    if (!beliEditModal.show) setWarning({ ...warning, show: false });
  }, [beliEditModal.show]);

  /**
   * Menjalankan request beli atau edit perahu ketika form modal disubmit
   */
  const formSubmit = async () => {
    if (beliEditModal.mode === "BELI") {
      try {
        const res = await fetch(`${apiUrl}/perahu`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...perahu,
            capacity: parseFloat(perahu.capacity),
          }),
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);
        setDaftarPerahu([...daftarPerahu, data.perahu]);
        handleClose();
      } catch (error) {
        setWarning({ show: true, message: error.message });
      }
    } else {
      try {
        const res = await fetch(`${apiUrl}/perahu/${beliEditModal.perahuId}`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...perahu,
            capacity: parseFloat(perahu.capacity),
          }),
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);
        const now = new Date().toLocaleString();
        setDaftarPerahu(
          daftarPerahu.map((item) =>
            item.id === beliEditModal.perahuId
              ? { ...item, ...perahu, updated_at: now }
              : item
          )
        );
        handleClose();
      } catch (error) {
        setWarning({ show: true, message: error.message });
      }
    }
  };

  return (
    <Modal show={beliEditModal.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {beliEditModal.mode === "BELI" ? "Beli Perahu" : "Edit Perahu"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {warning.show ? <Alert variant="warning">{warning.message}</Alert> : ""}
        <Form>
          <Form.Group className="mb-3" controlId="formPerahuName">
            <Form.Label>Nama perahu</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={perahu.name}
              onChange={(e) => setPerahu({ ...perahu, name: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPerahuDescription">
            <Form.Label>Deskripsi</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={perahu.description}
              onChange={(e) =>
                setPerahu({ ...perahu, description: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPerahuCapacity">
            <Form.Label>Kapasitas</Form.Label>
            <Form.Control
              type="number"
              value={perahu.capacity}
              onChange={(e) =>
                setPerahu({ ...perahu, capacity: e.target.value })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPerahuColor">
            <Form.Label>Warna</Form.Label>
            <Form.Select
              aria-label="Pilih warna"
              value={perahu.color}
              onChange={(e) => setPerahu({ ...perahu, color: e.target.value })}
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
        <Button variant="secondary" onClick={handleClose}>
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
