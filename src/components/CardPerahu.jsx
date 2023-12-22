import { Card, ListGroup, Button, Badge } from "react-bootstrap";
import {
  ApiUrlContext,
  DaftarPerahuContext,
  HeaderMessageContext,
} from "../App";
import { useContext, useEffect, useState } from "react";
import { BeliEditModalContext } from "./modals/BeliEditModalContextProvider";

/**
 * Fungsi untuk menentukan warna text (foreground) berdasarkan warna background
 */
const getForegroundFromBackground = (backgroundColor) => {
  const dummyElement = document.createElement("div");
  dummyElement.style.color = backgroundColor;
  document.body.appendChild(dummyElement);
  const rgb = getComputedStyle(dummyElement).color.match(/\d+/g);
  document.body.removeChild(dummyElement);
  const brightness = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return brightness > 0.5 ? "black" : "white";
};

export const CardPerahu = ({ perahu, handleShowJualModal }) => {
  const apiUrl = useContext(ApiUrlContext);
  const { daftarPerahu, setDaftarPerahu } = useContext(DaftarPerahuContext);
  const { showEditModal } = useContext(BeliEditModalContext);
  const { headerMessage, setHeaderMessage } = useContext(HeaderMessageContext);

  const [foregroundColor, setForegroundColor] = useState(
    getForegroundFromBackground(perahu.color)
  );

  // Update foreground color setiap kali terjadi update pada perahu.color
  useEffect(() => {
    setForegroundColor(getForegroundFromBackground(perahu.color));
  }, [perahu.color]);

  const toggleIsSailing = async () => {
    try {
      const res = await fetch(`${apiUrl}/perahu/${perahu.id}/berlayar`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
        },
      });
      const data = await res.json();
      if (data.status === "FAILED") throw new Error(data.message);
      const now = new Date();
      setDaftarPerahu(
        daftarPerahu.map((item) =>
          item.id === perahu.id
            ? { ...item, is_sailing: !item.is_sailing, updated_at: now }
            : item
        )
      );
      setHeaderMessage({ ...headerMessage, show: true, message: data.message });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Card className="flex-grow-1 overflow-hidden">
      <Card.Body
        style={{ backgroundColor: perahu.color, color: foregroundColor }}
      >
        <Card.Title className="d-flex align-items-center text-break fw-semibold">
          {perahu.name}
          {perahu.is_sailing ? (
            <Badge bg="info" className="ms-auto">
              Sedang berlayar
            </Badge>
          ) : (
            ""
          )}
        </Card.Title>
        <Card.Text>{perahu.description}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroup.Item>Capacity: {perahu.capacity}</ListGroup.Item>
        <ListGroup.Item>
          Bought at {new Date(perahu.bought_at).toLocaleString()}
        </ListGroup.Item>
        <ListGroup.Item>
          Last updated at {new Date(perahu.updated_at).toLocaleString()}
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-evenly">
          <Button variant="primary" onClick={() => showEditModal(perahu)}>
            Edit
          </Button>
          <Button variant="secondary" onClick={toggleIsSailing}>
            {perahu.is_sailing ? "Berlabuh" : "Berlayar"}
          </Button>
          <Button variant="danger" onClick={() => handleShowJualModal(perahu)}>
            Jual
          </Button>
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};
