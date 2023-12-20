import { useState, useEffect, createContext, useContext } from "react";
import { Header } from "./components/Header";
import { ListPerahu } from "./components/ListPerahu";
import { Button, Stack } from "react-bootstrap";
import BeliEditModal from "./components/modals/BeliEditModal";

export const ApiUrlContext = createContext(
  "https://oprec-betis-be.up.railway.app"
);
export const DaftarPerahuContext = createContext();
export const BeliEditModalContext = createContext();

function App() {
  const apiUrl = useContext(ApiUrlContext);

  const [daftarPerahu, setDaftarPerahu] = useState([]);
  const [beliEditModal, setBeliEditModal] = useState({
    show: false,
    mode: "BELI", // "BELI" atau "EDIT"
    perahuId: "",
  });

  const closeBeliEditModal = () => {
    setBeliEditModal((prevBeliEditModal) => ({
      ...prevBeliEditModal,
      show: false,
    }));
  };
  const showBeliModal = () => {
    setBeliEditModal((prevBeliEditModal) => ({
      ...prevBeliEditModal,
      show: true,
      mode: "BELI",
    }));
  };
  const showEditModal = (id) => {
    setBeliEditModal((prevBeliEditModal) => ({
      ...prevBeliEditModal,
      show: true,
      mode: "EDIT",
      perahuId: id,
    }));
  };

  // Mem-fetch daftar perahu ketika page load
  useEffect(() => {
    const getDaftarPerahu = async () => {
      try {
        const res = await fetch(`${apiUrl}/perahu`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          },
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);
        setDaftarPerahu(data.daftarPerahu);
      } catch (error) {
        console.error(error.message);
      }
    };

    getDaftarPerahu();
  }, []);

  return (
    <>
      <Header />
      <Stack direction="horizontal" className="container mb-3">
        <Button variant="primary" className="ms-auto" onClick={showBeliModal}>
          Beli Perahu
        </Button>
      </Stack>

      <DaftarPerahuContext.Provider value={{ daftarPerahu, setDaftarPerahu }}>
        <BeliEditModalContext.Provider value={{ beliEditModal, showEditModal }}>
          <ListPerahu />
          <BeliEditModal handleClose={closeBeliEditModal} />
        </BeliEditModalContext.Provider>
      </DaftarPerahuContext.Provider>
    </>
  );
}

export default App;
