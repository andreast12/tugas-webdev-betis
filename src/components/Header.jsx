import { Alert } from "react-bootstrap";
import { HeaderMessageContext } from "../App";
import { useContext } from "react";

export const Header = () => {
  const { headerMessage, setHeaderMessage } = useContext(HeaderMessageContext);

  return (
    <header className="pt-2">
      <div className="container">
        <h1 className="text-center fw-semibold">Tugas Webdev BETIS</h1>
        {headerMessage.show ? (
          <Alert
            variant={headerMessage.variant}
            onClose={() => setHeaderMessage({ ...headerMessage, show: false })}
            dismissible
          >
            {headerMessage.message}
          </Alert>
        ) : (
          ""
        )}
      </div>
    </header>
  );
};
