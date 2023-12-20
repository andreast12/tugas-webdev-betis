import { useContext, useState } from "react";
import { DaftarPerahuContext } from "../App";
import { Row, Col } from "react-bootstrap";
import { CardPerahu } from "./CardPerahu";
import JualModal from "./modals/JualModal";

export const ListPerahu = () => {
  const { daftarPerahu } = useContext(DaftarPerahuContext);

  const [jualModal, setJualModal] = useState({
    show: false,
    perahuId: "",
    perahuName: "",
  });

  const closeJualModal = () => setJualModal({ ...jualModal, show: false });
  const showJualModal = (perahuId, perahuName) => {
    setJualModal({ show: true, perahuId, perahuName });
  };

  return (
    <section>
      <div className="container">
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
      </div>
      <JualModal
        show={jualModal.show}
        handleClose={closeJualModal}
        perahuId={jualModal.perahuId}
        perahuName={jualModal.perahuName}
      />
    </section>
  );
};
