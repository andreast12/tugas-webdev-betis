import { createContext, useState, useEffect, useContext } from "react";
import { ApiUrlContext } from "../../App";

export const BeliEditModalContext = createContext();

export const BeliEditModalContextProvider = ({ children }) => {
  const apiUrl = useContext(ApiUrlContext);

  const [beliEditModal, setBeliEditModal] = useState({
    show: false,
    mode: "BELI", // "BELI" atau "EDIT"
    perahu: {
      id: "",
      name: "",
      description: "",
      capacity: "0",
      color: "",
    },
    warning: {
      show: false,
      message: "",
    },
  });
  const [daftarWarna, setDaftarWarna] = useState([]);

  // Fungsi show & close modal
  const showBeliModal = () => {
    setBeliEditModal((prevBeliEditModal) => ({
      ...prevBeliEditModal,
      show: true,
      mode: "BELI",
      perahu: {
        id: "",
        name: "",
        description: "",
        capacity: "0",
        color: daftarWarna[0],
      },
    }));
  };
  const showEditModal = ({ id, name, description, capacity, color }) => {
    setBeliEditModal((prevBeliEditModal) => ({
      ...prevBeliEditModal,
      show: true,
      mode: "EDIT",
      perahu: {
        id,
        name,
        description,
        capacity,
        color,
      },
    }));
  };
  const closeBeliEditModal = () => {
    setBeliEditModal((prevBeliEditModal) => ({
      ...prevBeliEditModal,
      show: false,
      warning: {
        ...prevBeliEditModal.warning,
        show: false,
      },
    }));
  };

  // Mem-fetch daftar warna ketika page load
  useEffect(() => {
    const getDaftarWarna = async () => {
      try {
        const res = await fetch(`${apiUrl}/perahu/warna`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`,
          },
        });
        const data = await res.json();
        if (data.status === "FAILED") throw new Error(data.message);
        setDaftarWarna(data.daftarWarna);
      } catch (error) {
        console.error(error.message);
      }
    };

    getDaftarWarna();
  }, []);

  return (
    <BeliEditModalContext.Provider
      value={{
        beliEditModal,
        setBeliEditModal,
        showBeliModal,
        showEditModal,
        closeBeliEditModal,
        daftarWarna,
      }}
    >
      {children}
    </BeliEditModalContext.Provider>
  );
};
