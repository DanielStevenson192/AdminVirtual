import { FC, useState } from "react";
import logo from "../../assets/icon-cards/cajahonor.png";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../core/shared/Spinner";
import iconAgendar from "../../assets/home/icono-agendar.png";
import iconAtencion from "../../assets/home/icono-atencion.png";
import iconCitas from "../../assets/home/icono-agendadas.png";
import iconHistorial from "../../assets/home/icono-historial.png";
import iconoDigital from "../../assets/icon-cards/icono-digital.png";
import iconoAutogestion from "../../assets/icon-cards/icono-autogestion.png";
// import {} from "bootstrap/js/dist/dropdown"
interface Props {
  Componente: any;
  setIsLogged: any;
}

export const Template: FC<Props> = ({ Componente, setIsLogged }) => {
  const navigate = useNavigate();
  const [spinner, setSpinner] = useState(false);
  const [menu, setMenu] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeSession = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setIsLogged(false);
  };
  return (
    <>
      {spinner && <Spinner show={spinner} />}

      <div className="container" style={{ margin: "0 auto 80px auto", }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-azul">
              <div className="row">
                <div className="col-md-3">
                  <div className="dropdown">
                    <button
                      className="btn-menu"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ backgroundColor: 'transparent !important' }}
                      onClick={() =>
                        setMenu(!menu)
                      }
                    >

                      <h3 className="col-men" >
                        {!menu ? <i
                          className="pi pi-home"
                          style={{ color: "white", fontSize: 30, position: "relative", top: "2px" }}
                        ></i> :
                          <i
                            className="pi pi-times-circle"
                            style={{ color: "white", fontSize: 30, position: "relative", top: "2px" }}
                          ></i>
                        }

                        {!menu ?
                          <strong style={{ marginLeft: 10 }}>Menu</strong>
                          :
                          <strong style={{ marginLeft: 10 }}>Cerrar</strong>
                        }

                      </h3>
                    </button>

                    <ul
                      className={menu ? 'dropdown-menu show' : "dropdown-menu"}
                      aria-labelledby="dropdownMenuButton1"
                    >


                      <li className="item-list">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setMenu(!menu)
                            navigate("/");
                          }}
                        >
                          <i
                            className="pi pi-home"
                            onClick={closeSession}
                            style={{
                              color: "black",
                              fontSize: 40,
                              marginLeft: 20,
                              marginBottom: 7,
                            }}
                          ></i>
                          <p className="ml-3">Inicio</p>
                        </div>
                      </li>

                      <li className="item-list">
                        <div
                          className="dropdown-item"

                          onClick={() => {
                            setMenu(!menu)
                            navigate("/request-procedure");
                          }}
                        >
                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">
                            <img className="img-men" style={{ width: "40px" }} src={iconoDigital} />
                            <p style={{ marginLeft: "30px" }}>Solicitar trámite <strong>DIGITAL</strong></p>
                          </div>

                        </div>
                      </li>



                      <li className="item-list">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setMenuOpen(!menuOpen);
                          }}
                        >
                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">

                            <img className="img-men" style={{ width: "40px" }} src={iconoAutogestion} />
                            <p style={{ marginLeft: "30px" }}>Bandeja de <strong>AUTOGESTIÓN</strong></p>
                          </div>

                        </div>

                        <ul className={menuOpen ? "menu-submenu-open" : "menu-submenu-close"}>
                          <li onClick={() => { setMenu(!menu); navigate("/my-procedure"); setMenuOpen(false); }}>Tramites en proceso</li>
                          <li onClick={() => { setMenu(!menu); navigate("/reject-procedure"); setMenuOpen(false); }}>Tramites devueltos</li>
                        </ul>
                      </li>




                      <li className="item-list">
                        <div
                          className="dropdown-item p-0"
                          onClick={() => {
                            setMenu(!menu)
                            navigate("/request-ticket");
                          }}
                        >

                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">

                            <img className="img-men " style={{ width: "50px" }} src={iconAtencion} />
                            <p style={{ marginLeft: "30px" }}>Atención en <strong>LÍNEA</strong></p>
                          </div>



                        </div>
                      </li>
                      <li className="item-list">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setMenu(!menu)
                            navigate("/assign-appointment");
                          }}
                        >


                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">
                            <img className="img-men " style={{ width: "50px" }} src={iconAgendar} />
                            <p style={{ marginLeft: "30px" }}>Agendar <strong>CITA</strong></p>
                          </div>


                        </div>
                      </li>
                      <li className="item-list">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setMenu(!menu)
                            navigate("/schedule-appointment");
                          }}
                        >

                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">
                            <img className="img-men " style={{ width: "50px" }} src={iconCitas} />
                            <p style={{ marginLeft: "30px" }}>Citas <strong>AGENDADAS</strong></p>
                          </div>


                        </div>
                      </li>
                      <li className="item-list">
                        <div
                          className="dropdown-item"
                          onClick={() => {
                            setMenu(!menu)
                            navigate("/dating-list");
                          }}
                        >

                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">
                            <img className="img-men " style={{ width: "50px" }} src={iconHistorial} />
                            <p style={{ marginLeft: "30px" }}>Historial de <strong>CITAS</strong></p>
                          </div>


                        </div>
                      </li>


                      <li className="item-list">
                        <div
                          className="dropdown-item"
                          onClick={closeSession}
                        >

                          <div style={{ marginLeft: "20px", display: "flex", alignItems: "center" }} className="caja-menu">
                            <i
                              className="pi pi-sign-out"
                              style={{
                                fontSize: "25px",
                                marginLeft: "10px",
                                marginRight: "10px",
                                color: "black"

                              }}
                            ></i>
                            <p style={{ marginLeft: "30px" }}>Cerrar <strong>SESIÓN</strong></p>
                          </div>


                        </div>
                      </li>
                    </ul>
                  </div>
                </div>



                <div className="col-md-3 d-flex cerrar-1">
                  <div className="texto-login">
                    <h3
                      style={{
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={closeSession}
                    >

                      <strong>Cerrar Sesión</strong>

                    </h3>
                    <i
                      className="pi pi-sign-out"
                      onClick={closeSession}
                      style={{
                        color: "white",
                        fontSize: 28,
                        marginLeft: 10,
                        marginBottom: 7

                      }}
                    ></i>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div
                className="col-blanco"
                style={{ position: "relative", zIndex: 1, padding: 20 }}
              >
                <img className="img-head" src={logo} />
              </div>
            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
        <div className="container">
          <div className="row fila-principal">
            <div className="col-md-11">
              <div className="col-envolved">
                <Componente setSpinner={setSpinner} />
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
