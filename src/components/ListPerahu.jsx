import { useContext, useState } from "react";
import { DaftarPerahuContext } from "../App";
import { Row, Col, Stack, Button } from "react-bootstrap";
import { CardPerahu } from "./CardPerahu";
import JualModal from "./modals/JualModal";
import { BeliEditModalContext } from "./modals/BeliEditModalContextProvider";

export const ListPerahu = () => {
  const { daftarPerahu } = useContext(DaftarPerahuContext);
  const { showBeliModal } = useContext(BeliEditModalContext);

  const [jualModal, setJualModal] = useState({
    show: false,
    perahu: {
      id: "",
      name: "",
    },
  });

  // Fungsi show & close modal
  const showJualModal = ({ id, name }) => {
    setJualModal((prevJualModal) => ({
      ...prevJualModal,
      show: true,
      perahu: { id, name },
    }));
  };
  const closeJualModal = () =>
    setJualModal((prevJualModal) => ({ ...prevJualModal, show: false }));

  return (
    <section className="pt-2 pb-4">
      <div className="container">
        <Stack direction="horizontal" className="mb-3">
          <Button variant="primary" className="ms-auto" onClick={showBeliModal}>
            Beli Perahu
          </Button>
        </Stack>

        <Row xs={1} md={2} lg={3} className="g-4">
          {daftarPerahu.map((perahu, index) => (
            <Col key={index} className="d-flex align-items-stretch">
              <CardPerahu
                key={perahu.id}
                perahu={perahu}
                handleShowJualModal={showJualModal}
              />
            </Col>
          ))}
        </Row>

        <JualModal
          show={jualModal.show}
          handleClose={closeJualModal}
          perahu={jualModal.perahu}
        />
      </div>
    </section>
  );
};
