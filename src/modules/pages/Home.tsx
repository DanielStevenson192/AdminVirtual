import { FC, useState, useEffect } from "react";
import agendar from "../../assets/home/SERV_PAGINA_PRINCIPAL_ATNCION EN LINEA.svg";
import solicitar from "../../assets/home/atencion_linea.png";
import verTurnos from "../../assets/home/histroial_citas.png";
import verAgenda from "../../assets/home/SERV_PAGINA_PRINCIPAL-03.svg";
import tramite from "../../assets/home/tramite.png"
import autoGestion from '../../assets/home/autogest.png'
import logo from "../../assets/icon-cards/cajahonor.png";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { GlobalService } from "../../core/services/GlobalService";
import { Dialog } from "primereact/dialog";
import { MCall } from "../../core/shared/MCall";
import { Spinner } from "../../core/shared/Spinner";
import "../styles/home.css";
import { ToastAlert } from "../../core/Components/Toast";
interface Props {
  setIsLogged: any;
}
const _globalService = new GlobalService();

export const Home: FC<Props> = ({ setIsLogged }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("usuario") || "");
  const [visible, setVisible] = useState<boolean>(false);
  const [list, setList] = useState<any>([]);
  const [listTickets, setListTickets] = useState<any>([]);
  const [showCall, setShowCall] = useState<any>(false);
  const [infoCall, setInfoCall] = useState<any>({});
  const [infoCallActive, setInfoCallActive] = useState<any>({});
  const [idTicket, setIdTicket] = useState<any>(null);
  const [showCallActive, setShowCallActive] = useState<any>();
  const [listQuotes, setListQuotes] = useState<any>([]);
  const [spinner, setSpinner] = useState(false);
  const [step, setStep] = useState(0);
  const { Toasty } = ToastAlert();
  const params = useParams();
  useEffect(() => {
    getAppointmentByAccount();
    getAppointmentByAccountForToday();
    getOpenAttentionTicketListByAccount();
    console.log("parametros", params);
  }, []);

  const closeSession = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    setIsLogged(false);
  };

  const getAppointmentByAccountForToday = () => {
    
    setSpinner(true)
    _globalService
      .getAppointmentByAccountForToday(user.DataBeanProperties.IDAccount)
      .subscribe((resp) => {
        setSpinner(false);
        setList(resp);
        setVisible(true);
      });
  };

  const getAppointmentByAccount = () => {
    setSpinner(true);
    _globalService
      .getAppointmentByAccount(null, null, user.DataBeanProperties.IDAccount)
      .subscribe((resp) => {
        setSpinner(false);
        console.log(resp);
        if (resp) {
          setListQuotes(resp);
        }
      });
  };

  const getOpenAttentionTicketListByAccount = () => {
    _globalService
      .getOpenAttentionTicketListByAccount(user.DataBeanProperties.IDAccount)
      .subscribe((resp) => {
        console.log(resp);
        if (resp) {
          if (resp.length > 0) {
            setListTickets(resp);
            setInfoCallActive({
              name: resp[0].CustomerVirtualName,
              room: resp[0].VirtualRoomName,
              turno: `${resp[0].Mnemonic}-${resp[0].Consecutive}`,
            });
            setIdTicket(resp[0].IDTicket);
          }
        }
      });
  };

  const handleStartService = (id: number, date: any) => {
    _globalService
      .createAttentionTicketFromAppointment(id, date)
      .subscribe((resp: any) => {
        if (resp) {
          setInfoCallActive({
            name: resp.CustomerVirtualName,
            ws:
              resp.WSSQuickTalk ||
              "wss://srv1.advantage.com.co/quicktalk/p2proom",
            room: resp.VirtualRoomName,
            turno: resp,
          });
          setIdTicket(resp.IDTicket);
          setShowCall(true);
        } else {
          Toasty({ type: "error", message: `No hubo respuesta del servidor` });
        }
      });
  };
  console.log(list.length > 0);
  console.log(listTickets.length > 0);

  const renderSwitch = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="padre-servicios">
              {/*CAJA-4 */}
              <div className="caja-servico flip-container">
                <div
                  className="col-card card"
                  onClick={() => {
                    navigate("/request-procedure");
                  }}
                >
                  <div className="envolver front">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="pad-img">
                            {" "}
                            <img className="img-fluid" src={tramite} style={{ maxHeight: 150 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="envolver back">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="card-atras p-3">
                            Aquí puede iniciar un trámite sin salir de casa
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*CAJA-4 */}
              <div className="caja-servico flip-container">
                <div
                  className="col-card card"
                  onClick={() => {
                    navigate("/procedure");
                  }}
                >
                  <div className="envolver front">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="pad-img">
                            {" "}
                            <img className="img-fluid" src={autoGestion} style={{ maxHeight: 150 }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="envolver back">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="card-atras p-3">
                            Consulte sus documentos pendientes por subir
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*CAJA-1 */}

              <div className="caja-servico flip-container">
                <div
                  className="col-card card"
                  onClick={() => {
                    navigate("/request-ticket");
                  }}
                >
                  <div className="envolver front">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="row">
                          <div className=""></div>
                          <div className="col-md-12 pad-img">
                            {" "}
                            <img className="img-card" src={solicitar} />
                          </div>
                          <div className=""></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="envolver back">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="card-atras p-3">
                            Aquí tome un turno y espere a que un asesor le
                            atienda en línea, esta opción es en tiempo real
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*CAJA-2 */}
              <div className="caja-servico flip-container">
                <div
                  className="col-card card"
                  onClick={() => {
                    navigate("/assign-appointment");
                  }}
                >
                  <div className="envolver front">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12 pad-img">
                            {" "}
                            <img className="img-card" src={agendar} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="envolver back">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="card-atras p-3">
                            Aquí podrá solicitar su cita para atención
                            presencial o virtual
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*CAJA-3 */}

              <div className="caja-servico flip-container">
                <div
                  className="col-card card"
                  onClick={() => {
                    navigate("/schedule-appointment");
                  }}
                >
                  <div className="envolver front">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="col-md-12 pad-img">
                            {" "}
                            <img className="img-card" src={verAgenda} />
                          </div>
                          <div className="notification">
                            {listQuotes.length > 0 && (
                              <h1>
                                <span className="red">{listQuotes.length}</span>
                              </h1>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="envolver back">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="card-atras p-3">
                            Si tiene citas agendadas, por favor acceda por esta
                            opción
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/*CAJA-4 */}
              <div className="caja-servico flip-container">
                <div
                  className="col-card card"
                  onClick={() => {
                    navigate("/dating-list");
                  }}
                >
                  <div className="envolver front">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="pad-img">
                            {" "}
                            <img className="img-card" src={verTurnos} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="envolver back">
                    <div className="row ">
                      <div className="col-md-12">
                        <div className="row">
                          <div className="card-atras p-3">
                            Aquí puede consultar su historial de citas
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 1:
        return (
          <>
            <MCall
              name={infoCall.name}
              room={infoCall.room}
              ws={
                infoCall.ws || "wss://srv1.advantage.com.co/quicktalk/p2proom"
              }
              tipo="cliente"
              show={showCall}
              setShow={setShowCall}
              turno={infoCall.turno}
              idTicket={idTicket}
            />
          </>
        );
      case 2:
        return (
          <>
            <MCall
              name={infoCallActive.name}
              room={infoCallActive.room}
              ws={"wss://srv1.advantage.com.co/quicktalk/p2proom"}
              tipo="cliente"
              show={showCallActive}
              setShow={setShowCallActive}
              turno={infoCallActive.turno}
              idTicket={idTicket}
            />
            <div
              className="mt-3"
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <Button
                label="Ir a la página principal"
                onClick={() => setStep(0)}
                className="homeButton"
              ></Button>
            </div>
          </>
        );
    }
  };
  return (
    <>
      {spinner && <Spinner show={spinner} />}
      <div className="container" style={{ margin: "0px auto 80px auto" }}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-azul">
              <div className="row">
                <div className="col-md-3 entityName">
                  <h6 style={{ color: "white" }}>
                    <h3>
                      <strong style={{ color: "white" }}>Bienvenido</strong>
                    </h3>{" "}
                    <p className="mt-2 text-capitalize">
                      {`${user.DataBeanProperties.Name1} ${user.DataBeanProperties.Surname1}`}
                      
                    </p>
                  </h6>
                </div>
                <div className="col-sm-12 col-md-3 d-flex cerrar-1">
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
                      className="pi pi-sign-out icon icono-close"
                      onClick={closeSession}
                      style={{
                        color: "white",
                        fontSize: 28,
                        marginLeft: 10,
                        marginBottom: 7,
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
            <div className="col-md-12">
              <div className="col-envolved">{renderSwitch()}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {(listTickets.length > 0 || list.length > 0) && (
          <Dialog
            header="Agenda del día"
            className="alerta-inicio"
            visible={visible}
            modal
            onHide={() => {
              setVisible(false);
            }}
          >
            <>
              {list.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "30px",
                  }}
                >
                  <h3>Citas del día</h3>{" "}
                  <Button
                    label="Ver mi agenda"
                    // style={{ height: 40 }}
                    onClick={() => {
                      navigate("/schedule-appointment");
                    }}
                  ></Button>
                </div>
              )}
              {list.length > 0
                ? list.map((element: any) => {
                  const date = new Date().getTime();
                  const assignedDate = new Date(element.FromDate).getTime();
                  const avaible = assignedDate - date;

                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 20,
                        }}
                      >
                        <i className="pi pi-bookmark-fill mr-2"></i>{" "}
                        <div>
                          Tiene una cita asignada para{" "}
                          {element.AttentionIDName.toLowerCase()} por medio{" "}
                          {element.ChannelTypeName.toLowerCase()} a las{" "}
                          {element.FromDate.slice(11)}.
                        </div>
                        <div style={{ margin: "0 auto" }}></div>
                      </div>
                    </>
                  );
                })
                : ""}
              {listTickets.length > 0 && list.length > 0 && (
                <Divider layout="horizontal" />
              )}

              {listTickets.length > 0 && <h3>Turnos Activos</h3>}
              {listTickets.length > 0
                ? listTickets.map((element: any, idx: any) => {
                  return (
                    <>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          marginBottom: 20,
                        }}
                        key={idx}
                      >
                        <i className="pi pi-bookmark-fill mr-2"></i>{" "}
                        <div>
                          Tiene un turno activo de{" "}
                          {element.AttentionIDName.toLowerCase()} abierto a
                          las {element.FromDate.slice(11)}.
                        </div>
                        <div
                          style={{
                            width: "100%",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            style={{ height: 25, padding: "15px 30px" }}
                            className="btn-modal"
                            onClick={() => {
                              setStep(2);
                              setVisible(false);
                            }}
                          >
                            Reconectar
                          </Button>
                        </div>
                      </div>
                    </>
                  );
                })
                : ""}
            </>
          </Dialog>
        )}
      </div>
    </>
  );
};
