import { FC, useEffect, useState } from "react";
import { Card } from "primereact/card";
import { GlobalService } from "../../core/services/GlobalService";
import { Button } from "primereact/button";
import { Descripcion } from "../../core/Components/Descripcion";
import { Dialog } from "primereact/dialog";
import { MCall } from "../../core/shared/MCall";
import { addLocale } from "primereact/api";
import "../styles/schedule.css";
import { ToastAlert } from "../../core/Components/Toast";
import { Col, Row } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import imageWatermark from "../../assets/img/home-01.png";


const _globalService = new GlobalService();
interface Props {
  setSpinner: any;
}
interface CancelDate {
  IDAppointment: any;
  FromDate: any;
}
export const ScheduleAppointment: FC<Props> = ({ setSpinner }) => {
  const [list, setList] = useState<any>([]);
  const [showCancelDate, setShowCancelDate] = useState(false);
  const [cancelInfo, setCancelInfo] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [infoDate, setInfoDate] = useState<any>({});
  const [showCall, setShowCall] = useState<any>(false);
  const [infoCall, setInfoCall] = useState<any>({});
  const hora: any = new Date().getTime();
  const [value1, setValue1] = useState<boolean>(false);
  const [value2, setValue2] = useState<boolean>(true);
  const [data, setData] = useState<any>({})
  const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const [state, setState] = useState(0);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>({});
  const [objData, setObjData] = useState<any>({});
  const [objItem, setObjItem] = useState<any>();

  const { Toasty } = ToastAlert();

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties);
    getAppointmentByAccount();
  }, []);


  const obtenerMes = (date: any) => {
    return meses[(date.getMonth())]
  }

  const getAppointmentByAccount = () => {
    setSpinner(true);
    _globalService
      .getAppointmentByAccount(
        null,
        null,
        JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
          .IDAccount
      )
      .subscribe(
        (resp: any) => {
          console.log(resp);
          setSpinner(false);
          if (resp) {

            if (resp.length > 0) {
              console.log(resp);
              resp.forEach((element: any) => {
                if (element.ChannelType) {
                  if (element.ChannelType === 13) {
                    element.myView = true;
                    element.myButton = "Me encuentro en el lugar";
                    element.myIcon = "pi pi-map-marker";
                  } else {
                    element.myView = false;
                    element.myButton = "Acceder a la cita";
                    element.myIcon = "pi pi-video";
                  }
                }
                if (element.FromDate) {
                  const temp = new Date().getTime();
                  const temp2 = new Date(element.FromDate).getTime();
                  const result = temp2 - temp;
                  if (result <= 300000) {
                    element.myViewButton = false;
                  } else {
                    element.myViewButton = true;
                  }
                }
              });
              setList(resp);

            } else {
              setSpinner(false);
              setList([]);
              Toasty({
                type: "error",
                message: `No se encontraron resultados`,
              });
            }
          } else {
            setSpinner(false);
            Toasty({
              type: "error",
              message: `No hubo respuesta del servidor`,
            });
          }
        },
        (err) => {
          setSpinner(false);
        }
      );
  };

  const handleStartService = (id: number, date: any) => {
    _globalService
      .createAttentionTicketFromAppointment(id, date)
      .subscribe((resp: any) => {
        if (resp) {
          if (resp.ErrorMessage) {
            Toasty({
              type: "error",
              message: `Podras acceder a la llamada  solo 5 minutos antes de que sea la hora de la misma`,
            });
          }
          if (resp.ChannelType === 14) {
            setInfoCall({
              name: resp.CustomerVirtualName,
              ws: resp.WSSQuickTalk,
              room: resp.VirtualRoomName,
              idTicket: resp.IDTicket,
              turno: resp.Mnemonic + resp.Consecutive,
            });
          }
          if (resp.ChannelType === 13) {
            setInfoCall({
              idTicket: resp.IDTicket,
              turno: resp.Mnemonic + resp.Consecutive,
            });
          }
        } else {
          Toasty({
            type: "error",
            message: `No se recibio respuesta del servidor`,
          });
        }
      });
  };
  addLocale("es", {
    firstDayOfWeek: 1,
    dayNames: [
      "domingo",
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
    ],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["DO", "LU", "MA", "MI", "JU", "VI", "SA"],
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthNamesShort: [
      "ene",
      "feb",
      "mar",
      "abr",
      "may",
      "jun",
      "jul",
      "ago",
      "sep",
      "oct",
      "nov",
      "dic",
    ],
    today: "Hoy",
    clear: "Limpiar",
  });

  const handleCancelDate = (info: CancelDate, desc: string) => {
    console.log(
      "codigo del usuario actual",
      JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
        .IDAccount
    );
    setSpinner(true);
    _globalService
      .cancelAppointment(
        info.IDAppointment,
        info.FromDate,
        JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
          .IDAccount,
        desc
      )
      .subscribe((resp: any) => {
        getAppointmentByAccount();
        setSpinner(false);
      });
  };


  const permitirCita = (item: any) => {
    console.log(item);
    const current = new Date();
    console.log(current.getHours());
    console.log(current.getMinutes());
    const temp = new Date(item.FromDate);
    console.log(temp.getHours());
    console.log(temp.getMinutes());
    if (temp.getHours() > current.getHours() && temp.getMinutes() > current.getMinutes()) {
      Toasty({
        type: "error",
        message: "Su cita ya no es válida",
      });
    } else {
      if (item.ChannelType === 14) {
        setState(2);
        setObjItem(item);
        const { IDAppointment, FromDate } = item;
        setObjData(item);
        setData({ IDAppointment: IDAppointment, FromDate: FromDate });
      }
      if (item.ChannelType === 13) {
        setObjItem(item);
        setState(2);
        handleStartService(item.IDAppointment, item.FromDate);
      }
    }
  }


  const solicitarCita = () => {
    console.log(data.IDAppointment, data.FromDate);
    handleStartService(data.IDAppointment, data.FromDate);
    setState(1);
    setShowCall(true);
  }

  const cancelarCita = (item: any) => {
    const { IDAppointment, FromDate } = item;
    setCancelInfo({
      IDAppointment: IDAppointment,
      FromDate: FromDate,
    });
    setShowCancelDate(true);
  }


  const formTypeHora = (fecha: any) => {
    return new Date(fecha).getHours() >= 12 ? "PM" : "AM"
  }

  const formHora = (fecha: any) => {
    return new Date(fecha).getHours()
  }

  const formMinutos = (fecha: any) => {
    return new Date(fecha).getMinutes() <= (9 | 0) ? "0" + new Date(fecha).getMinutes() : new Date(fecha).getMinutes()
  }
  const focus1 = () => {
    setValue1(true);
    setValue2(false);
  }

  const focus2 = () => {
    setValue2(true);
    setValue1(false);
  }

  function camelize(str: string) {
    let msg: string = '';
    let first: string = '';
    if (str !== null) {
      if (str !== undefined) {
        let aux: string[] = str.split(' ');
        first = aux[0].replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
          return index === 0 ? word.toUpperCase() : word.toLowerCase();
        }).replace(/\s+/g, '');
        aux.map((word, index) => {
          if (index !== 0) {
            msg += ' ' + word.toLowerCase();
          }
        });
      }
    }
    return first + msg;
  };

  const renderSwitch = () => {
    switch (state) {
      case 0:
        return (
          <>
            <div style={{ padding: "10px", display: "flex", justifyContent: "flex-end" }} className="caja-padre-vista">
              <button className="btn-diseño-1" onClick={focus1} data-focus={value1}>
                <i className="pi pi-table" style={{ fontSize: "20px" }}></i>
              </button>
              <button className="btn-diseño-2" onClick={focus2} data-focus={value2}>
                <i className="pi pi-microsoft" style={{ fontSize: "20px" }}></i>
              </button>
            </div>
            <Card
              className="table-shadow"
              style={{ textAlign: "center" }}
            >
              <div className="schedule__title">
                <h1 className="text-center mb-5">CITAS AGENDADAS</h1>
              </div>
              {
                list.length > 0 ?
                  value2 ?
                    <section className="table-citas-agendadas">
                      {list.map((item: any, index: number) => (
                        <div className="card-citas-agendadas" key={index}>
                          <div className="card-head">
                            <div className="letter_watermark_agenda">
                              <img src={imageWatermark} alt="watermark" />
                            </div>
                            <h1>
                              Hola <b>{camelize(user.Name1)} {camelize(user.Name2)} {camelize(user.Surname1)} {camelize(user.Surname2)}</b>, la cita de <b>{camelize(item.AttentionIDName)}</b> ha sido agendada para el
                              <b> día {new Date(item.FromDate).getDate()} de {obtenerMes(new Date(item.FromDate))}, {new Date(item.FromDate).getFullYear()} a las {formHora(item.FromDate)}:{formMinutos(item.FromDate)} {formTypeHora(item.FromDate)} </b> por el <b>{item.ChannelTypeName.toLowerCase()}</b> {item.myView ? <>en <b>{camelize(item.AttentionOfficeName)}</b></> : ""}.
                            </h1>
                            <ul>
                              <li>
                                El botón <b>{item.myButton}</b> se habilitará 5 minutos antes de la hora agendada.
                              </li>
                              {item.ChannelType === 13 ?
                                <li>
                                  Recuerde estar en el lugar de atención.
                                </li> : ""}
                              <li>
                                Para mas información comuníquese al canal de atención <b>Centro de Contacto al Ciudadano (601) 7557070</b>.
                              </li>
                            </ul>
                            <Row className="mt-3">
                              <Col sm={12} xl={6}>
                                <Button
                                  icon={item.myIcon}
                                  label={item.myButton}
                                  className="btn-calendar-buscar mt-2"
                                  onClick={() => { permitirCita(item) }}
                                  disabled={item.myViewButton}
                                  style={{ width: '100%' }}
                                />
                              </Col>
                              <Col sm={12} xl={6}>
                                <Button
                                  icon="pi pi-times-circle"
                                  label="Cancelar Cita"
                                  className="btn-calendar-buscar mt-2"
                                  onClick={() => { cancelarCita(item) }}
                                  style={{ width: '100%' }}
                                />
                              </Col>
                            </Row>
                          </div>
                        </div>
                      ))}
                    </section>
                    : <DataTable
                      className="table-turn"
                      value={list}
                      paginator
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Mostrando {first} hasta {last} de {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                    >

                      <Column
                        field="FromDate"
                        header="Fecha de inicio"
                        style={{ fontSize: "14px" }}
                      ></Column>
                      <Column
                        field="ChannelTypeName"
                        header="Tipo de atención"
                        style={{ fontSize: "14px" }}
                      ></Column>
                      <Column
                        field="StateName"
                        header="Estado"
                        style={{ fontSize: "14px" }}
                      ></Column>
                      <Column
                        field="AttentionIDName"
                        header="Servicio"
                        style={{ texAling: "center", fontSize: "14px" }}
                      ></Column>

                      <Column
                        field="AttentionOfficeName"
                        header="Oficina"
                        style={{ texAling: "center", fontSize: "14px" }}
                      ></Column>

                      <Column
                        body={(item: any) => {
                          return (
                            <>
                              <Button
                                onClick={() => {
                                  permitirCita(item);

                                }}
                                className="btn-calendar-buscar mt-2"
                                icon={item.myIcon}
                                style={{ fontSize: "10px" }}
                                disabled={item.myViewButton}
                                tooltip="Podras iniciar a la cita 5 minutos antes."
                              />
                              <Button
                                onClick={() => {
                                  cancelarCita(item)
                                }}
                                className="btn-calendar-buscar mt-2"
                                icon="pi pi-times-circle"
                                style={{ fontSize: "10px" }}
                                tooltip="Cancelar Cita."
                              />
                            </>
                          )
                        }}
                        header="Acciones"
                        style={{ width: "10%" }}

                      ></Column>
                    </DataTable>
                  : <h1>No tienes citas agendadas</h1>}

            </Card>
            <Descripcion
              setShow={setShowCancelDate}
              show={showCancelDate}
              title={"¿Cual es el motivo de cancelación?"}
              handleFunction={handleCancelDate}
              info={cancelInfo}
            />
          </>
        )


      case 1:
        return (
          <>
            <div
              className="mt-3"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <Button
                label="Ir a la página principal"
                onClick={() => navigate("/dashboard")}
                className="homeButton1"
                icon=' pi pi-home'
                iconPos="left"
              ></Button>
            </div>
            {showCall && (
              <MCall
                name={infoCall.name}
                room={infoCall.room}
                ws={infoCall.ws}
                tipo="cliente"
                show={showCall}
                setShow={setShowCall}
                turno={infoCall.turno}
                idTicket={infoCall.idTicket}
              />
            )}
          </>
        )

      case 2:
        return (
          <Row className="letter">
            <Col sm={12} className="letter_text">
              {objItem.ChannelType === 14 ?
                <>
                  <div className="letter_check">
                    <i className="pi pi-check-circle"></i>
                  </div>
                  <div className="letter_watermark_confirm">
                    <img src={imageWatermark} alt="watermark" />
                  </div>
                  <h1>La cita ha sido confirmada</h1>
                  <h2>Hola <b>{camelize(user.Name1)} {camelize(user.Name2)} {camelize(user.Surname1)} {camelize(user.Surname2)}</b>
                    tiene una cita por concepto de <b>{objData.ChannelTypeName.toLowerCase()} </b>
                    para el <b>día {new Date(objData.FromDate).getDate()}  de {obtenerMes(new Date(objData.FromDate))}, {new Date(objData.FromDate).getFullYear()} a las {formHora(objData.FromDate)}:{formMinutos(objData.FromDate)} {formTypeHora(objData.FromDate)}</b>.</h2>
                  <h2>Tenga en cuenta las siguientes recomendaciones:</h2>
                  <ul>
                    <li>Debe tener cámara y micrófono habilitados para brindarle una atención adecuada.</li>
                    {/* <li>Podrá acceder 5 minutos antes de lo programado a la cita.</li> */}
                    <li>El asesor entrará a la llamada en el momento que tenga disponibilidad.</li>
                    <li>Recuerde calificar el servicio al finalizar la atención.</li>
                    {/* <li>Si tiene alguna sugerencia puede llamar a las siguientes líneas telefónicas.</li> */}
                  </ul>
                  <h2>Nota:</h2>
                  <p style={{ textAlign: "justify" }}>Para efectos de calidad del servicio, su llamada puede ser grabada y monitoreada, debe aceptar los permisos del navegador para iniciar la videollamada. Sus datos personales serán tratados bajo principios de seguridad y confidencialidad aplicables, con el propósito de ser incluidos en nuestras bases de datos y propocionarle un servicio de calidad.</p>
                  <div className="letter_footer">
                    <h4><b>BIENESTAR Y EXCELENCIA</b></h4>
                  </div>
                  <Row className="mt-3">
                    <Col sm={12} >
                      <Button
                        icon="pi pi-video"
                        label="Iniciar video llamada"
                        className="btn-calendar-buscar mt-2"
                        style={{ width: '100%' }}
                        onClick={() => {
                          solicitarCita()
                        }}
                      />
                    </Col>
                  </Row>
                </>
                :
                <>
                  <div className="letter_check">
                    <i className="pi pi-check-circle"></i>
                  </div>
                  <div className="letter_watermark_confirm">
                    <img src={imageWatermark} alt="watermark" />
                  </div>
                  <h1>La cita ha sido confirmada</h1>
                  <h3 className="letter_turn_text mt-5">Turno: {infoCall.turno}</h3>
                  <h2>Hola <b>{camelize(user.Name1)} {camelize(user.Name2)} {camelize(user.Surname1)} {camelize(user.Surname2)}</b>
                    tiene una cita por concepto de <b>{objItem.ChannelTypeName.toLowerCase()} </b>
                    para el <b>día {new Date(objItem.FromDate).getDate()}  de {obtenerMes(new Date(objItem.FromDate))}, {new Date(objItem.FromDate).getFullYear()} a las {formHora(objItem.FromDate)}:{formMinutos(objItem.FromDate)} {formTypeHora(objItem.FromDate)}</b>.</h2>
                  <h2>Tenga en cuenta las siguientes recomendaciones:</h2>
                  <ul>
                    <li>Pronto será llamado por el asesor.</li>
                    <li>Debe estar pendiente de las pantallas de la entidad para el llamado del turno.</li>
                  </ul>
                  <div className="letter_footer">
                    <h4><b>BIENESTAR Y EXCELENCIA</b></h4>
                  </div>
                </>
              }
            </Col>
            {objItem.ChannelType === 13 ?
              <Col sm={12} className="mt-3 text-center">
                <Button
                  label="Ir a la Página Principal"
                  iconPos="right"
                  icon="pi pi-arrow-up-right"
                  className="schedule__boton"
                  onClick={() => {
                    navigate("/");
                  }}
                />
              </Col> : ""}
          </Row>
        )

      case 3:
        return (
          showCall && (
            <Dialog
              header="Información de cancelación de cita"
              visible={showInfo}
              style={{ width: "50vw" }}
              modal
              onHide={() => {
                setShowInfo(false);
              }}
            >
              <div style={{ display: "flex", gap: "10px" }}>
                <Card>
                  <h4>Fecha de Cancelación:</h4>
                  <p style={{ fontSize: 20 }}>{infoDate.fecha}</p>
                </Card>
                <Card>
                  <h4>¿Quíen cancelo?:</h4>
                  <p style={{ fontSize: 20 }}>{infoDate.nombre}</p>
                </Card>
                <Card>
                  <h4>Descripción:</h4>
                  <p style={{ fontSize: 18 }}>{infoDate.descripcion}</p>
                </Card>
              </div>
            </Dialog>
          )

        )
    }

  }

  return (
    <>
      {renderSwitch()}
    </>

  );
}
{/* <div className="letter_pre_footer">
  <h3>Centro de Contacto al Ciudadano CCC en Bogotá <strong>6017557070</strong></h3>
  <h3>Línea gratuita nacional <strong>018000185570</strong></h3>
  <h3><strong>www.cajahonor.gov.co</strong> - <strong>contactenos@cajahonor.gov.co</strong></h3>
  <h3>Carrera 54 N°. 26-54 - Bogotá D.C. Colombia</h3>
</div> */}