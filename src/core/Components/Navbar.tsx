import { FC, useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "primereact/button";
import logo from '../../assets/img/home-01.png'
import { Card } from "primereact/card";
interface Props {
  setIsLogged: any;
}

export const Navbar: FC<Props> = ({ setIsLogged }) => {
  let navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      navigate("/dashboard");
    }
  }, []);

  const closeSession = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setIsLogged(false);
  };

  const items = [
    {
      label: "Servicios",
      icon: "pi pi-fw pi-home",
      command: () => {
        navigate("/dashboard");
      },
    },
    {
      label: "Historial de turnos",
      icon: "pi pi-fw pi-calendar",
      command: () => {
        navigate("/dating-list");
      },
    },
    {
      label: "Solicitar ticket",
      icon: "pi pi-fw pi-pencil",
      command: () => {
        navigate("/request-ticket");
      },
    },
    {
      label: "Agendar cita",
      icon: "pi pi-fw pi-file",
      command: () => {
        navigate("/assign-appointment");
      },
    },
    {
      label: "Agenda programada",
      icon: "pi pi-fw pi-calendar",
      command: () => {
        navigate("/schedule-appointment");
      },
    },
  ];


  const start= <img src={logo} alt="" style={{width:80,height:75,objectFit:'contain'}} />

  const end = (
    <Button
      label="Cerrar Sesion"
      icon="pi pi-power-off"
      iconPos="right"
      className="closeSession--button p-button"
      onClick={closeSession}
    />
  );
  return (
    <>
      <div className="card navCard">
        <Menubar model={items} className="navCard__menu"  start={start} end={end} />
      </div>
    </>
  );
};
