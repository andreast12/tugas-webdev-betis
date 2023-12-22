import { useState, useEffect, createContext, useContext } from "react";
import { Header } from "./components/Header";
import { ListPerahu } from "./components/ListPerahu";
import BeliEditModal from "./components/modals/BeliEditModal";
import { BeliEditModalContextProvider } from "./components/modals/BeliEditModalContextProvider";

export const ApiUrlContext = createContext(
  "https://oprec-betis-be.up.railway.app"
);
export const DaftarPerahuContext = createContext();
export const HeaderMessageContext = createContext();

function App() {
  const apiUrl = useContext(ApiUrlContext);

  const [daftarPerahu, setDaftarPerahu] = useState([]);
  const [headerMessage, setHeaderMessage] = useState({
    show: false,
    message: "",
    variant: "success",
  });

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
      <HeaderMessageContext.Provider
        value={{ headerMessage, setHeaderMessage }}
      >
        <Header />
        <DaftarPerahuContext.Provider value={{ daftarPerahu, setDaftarPerahu }}>
          <BeliEditModalContextProvider>
            <ListPerahu />
            <BeliEditModal />
          </BeliEditModalContextProvider>
        </DaftarPerahuContext.Provider>
      </HeaderMessageContext.Provider>
    </>
  );
}

export default App;
