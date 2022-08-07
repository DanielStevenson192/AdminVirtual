import { FC, useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { AdminService } from "../../core/services/AdminService";
import { MCall } from "../../core/shared/MCall";
import { ToastAlert } from "../../core/Components/Toast";
import "../styles/datascroll.css";
import "../styles/requestTicket.css";
import { useNavigate } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import marcaAgua from "../../assets/img/home-01.png";
import { BpmService } from "../../core/services/BpmService";
import { TrayService } from "../../core/services/TrayService";
import { Console } from "console";
interface Props {
  specialCall?: boolean;
  setSpecialStep?: any;
  setIDLn?: any;
  setSpinner: any;
}

enum Atencion {
  radicados,
  pqr,
}

const _adminService = new AdminService();
const _trayService = new TrayService();
const _bpmService = new BpmService();

export const RequestTicket: FC<Props> = ({
  specialCall,
  setSpecialStep,
  setIDLn,
  setSpinner,
}) => {
  const { Toasty } = ToastAlert();

  const [list, setList] = useState<any>([]);
  const [user, setUser] = useState<any>({});
  const [showDialog, setShowDialog] = useState(true);
  const [nameTicket, setNameTicket] = useState("");
  const [room, setRoom] = useState("");
  const [ws, setWs] = useState("");
  const [turno, setTurno] = useState("");
  const [idTicket, setIdTicket] = useState<any>(null);
  const [office, setOffice] = useState<any>(null);
  const [step, setStep] = useState(-1);
  const [servicio, setServicio] = useState("");
  const navigate = useNavigate();
  const [listChild1, setListChild1] = useState<any[]>([]);
  const [firstChild, setFirstChild] = useState<any>();
  const [listChild2, setListChild2] = useState<any[]>([]);
  const [secondChild, setSecondChild] = useState<any>();
  const [listChild3, setListChild3] = useState<any[]>([]);
  const [thirdChild, setThirdChild] = useState<any>();
  const [listChild4, setListChild4] = useState<any[]>([]);
  const [fourthChild, setfourthChild] = useState<any>();
  const [fifthChild, setFifthChild] = useState<any[]>([]);
  const [dsBtn, setDsBtn] = useState(true);
  const [serviceSelect, setServiceSelect] = useState<any>();
  const [listAvailableAgenda, setListAvailableAgenda] = useState<any[]>([]);
  const [availableAgenda, setAvailableAgenda] = useState(0);
  const [listOfficeAgenda, setListOfficeAgenda] = useState<any[]>([]);
  const [officeAgenda, setOfficeAgenda] = useState(0);
  const [listChildsAgenda, setListChildsAgenda] = useState<any[]>([]);
  const [childsAgenda, setChildsAgenda] = useState(0);
  const [dsBtnRad, setDsBtnRad] = useState<any>(true);
  const [kindAtention, setKindAtention] = useState<any>(null);
  const [title, setTitle] = useState<any>(null);
  const [infoProcedure, setInfoProcedure] = useState<any>(null);
  useEffect(() => {
    setUser(
      JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
    );
    getAvailableAgendaRequestCatalog(
      JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
        .IDAccount
    );
    getAttentionOfficeCatalogByChannelType();
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      setOffice(list[0].DataBeanProperties.IDAttentionOffice);
    }
  }, [list]);

  useEffect(() => {
    getOfficeChild(office, setListChild1);
    setDsBtn(true);
  }, [office]);
  useEffect(() => {
    const aux = listOfficeAgenda.filter(
      (item: any) => item.IDAttentionOffice === officeAgenda
    );
    if (aux.length > 0) {
      console.log("datos de virtualiad");
      setDsBtnRad(!aux[0].VirtualChannel);
      if (!aux[0].VirtualChannel) {
        Toasty({
          type: "warning",
          message: `Esta oficina no tiene servicio virtual`,
        });
      }
    }
  }, [officeAgenda]);

  const getAttentionOfficeCatalogByChannelType = () => {
    setSpinner(true);
    _adminService
      .getAttentionOfficeCatalogByChannelType(14)
      .subscribe((resp: any) => {
        setSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          setList(resp.DataBeanProperties.ObjectValue);
        } else {
          Toasty({
            type: "error",
            message: `No hubo respuesta del servidor`,
          });
        }
      });
  };

  const getAvailableAgendaRequestCatalog = (idAccount: any) => {
    setSpinner(true);
    _adminService
      .getAvailableAgendaRequestCatalog(idAccount)
      .subscribe((resp: any) => {
        console.log(resp);
        setSpinner(false);
        if (resp) {
          if (resp.length > 0) {
            setStep(1);
            setListAvailableAgenda(resp);
          } else {
            setStep(0);
          }
        } else {
          Toasty({
            type: "error",
            message: `No hubo respuesta del servidor`,
          });
        }
      });
  };

  const getAttentionOfficeByAgendaRequest = (idAgendaRequest: any) => {
    setSpinner(true);
    _adminService
      .getAttentionOfficeByAgendaRequest(idAgendaRequest)
      .subscribe((resp: any) => {
        console.log("respuesta de byagenda", resp);
        setSpinner(false);
        if (resp) {
          setListOfficeAgenda(resp);
        } else {
          Toasty({
            type: "error",
            message: `No hubo respuesta del servidor`,
          });
        }
      });
  };

  const getAttentionIDChildsForAgendaRequest = (
    idAttentionOffice: any,
    idAgendaRequest: any
  ): any => {
    setSpinner(true);
    _adminService
      .getAttentionIDChildsForAgendaRequest(idAttentionOffice, idAgendaRequest)
      .subscribe((resp: any) => {
        console.log("repuesta de servicio readicados", resp);
        setSpinner(false);
        if (resp) {
          setListChildsAgenda(resp);
        } else {
          Toasty({
            type: "error",
            message: `No hubo respuesta del servidor`,
          });
        }
      });
  };

  function camelize(str: string) {
    let msg: string = "";
    let first: string = "";
    if (str !== null) {
      if (str !== undefined) {
        let aux: string[] = str.split(" ");
        first = aux[0]
          .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
            return index === 0 ? word.toUpperCase() : word.toLowerCase();
          })
          .replace(/\s+/g, "");
        aux.map((word, index) => {
          if (index !== 0) {
            msg += " " + word.toLowerCase();
          }
        });
      }
    }
    return first + msg;
  }

  function getOfficeChild(office: number, set: any) {
    setSpinner(true);
    _adminService.getAttentionIDChilds(0, office).subscribe((resp: any) => {
      setSpinner(false);
      if (resp.DataBeanProperties.ErrorMessage) {
        return;
      } else {
        set(
          resp.DataBeanProperties.ObjectValue.map((item: any) => {
            return {
              label: item.DataBeanProperties.Name,
              value: item.DataBeanProperties.IDLn,
            };
          })
        );
      }
    });
  }
  function getChild(set: any, idln: number) {
    setSpinner(true);
    _adminService.getAttentionIDChilds(idln, office).subscribe((resp: any) => {
      setSpinner(false);
      if (resp.DataBeanProperties.ErrorMessage) {
        Toasty({
          type: "error",
          message: `No hubo respuetsa del servidor`,
        });
        return;
      }
      if (resp.DataBeanProperties.ObjectValue.length > 0) {
        setDsBtn(true);
        set(
          resp.DataBeanProperties.ObjectValue.map((item: any) => {
            return {
              label: item.DataBeanProperties.Name,
              value: item.DataBeanProperties.IDLn,
            };
          })
        );
      } else {
        set([]);
        setDsBtn(false);
      }
    });
  }
  const getAttentionTicket = (
    idCustomerType: any,
    idLn: number,
    idAccount: number,
    nit: number,
    idCharacterization: number,
    channelType: number
  ) => {
    setSpinner(true);
    _adminService
      .getAttentionTicket(
        idCustomerType,
        idLn,
        idAccount,
        nit,
        idCharacterization,
        channelType
      )
      .subscribe((resp: any) => {
        console.log(resp);
        setSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          setServicio(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.Service
          );
          setIdTicket(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.IDTicket
          );
          setNameTicket(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .CustomerVirtualName
          );
          setRoom(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .VirtualRoomName
          );
          setWs(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.WSSQuickTalk
          );
          setTurno(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.Mnemonic +
              "-" +
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.Consecutive
          );
          console.log("Finalizo");
          setStep(3);
        } else {
          setSpinner(false);
          Toasty({
            type: "error",
            message: `No se pudo generar el ticket ${resp.DataBeanProperties.ErrorMessage}`,
          });
        }
      });
  };
  const getActualProcedureActionByProcedureImp = (idProcedureImp: number) => {
    _bpmService
      .getActualProcedureActionByProcedureImp(idProcedureImp)
      .subscribe((resp: any) => {
        setInfoProcedure(resp[0]);
      });
  };
  const getAttentionTicketAgenda = (
    idCustomerType: any,
    idLn: number,
    idAccount: number,
    nit: number,
    idCharacterization: number,
    channelType: number,
    agenda: number
  ) => {
    setSpinner(true);
    _adminService
      .getAttentionTicketAgenda(
        idCustomerType,
        idLn,
        idAccount,
        nit,
        idCharacterization,
        channelType,
        agenda
      )
      .subscribe((resp: any) => {
        console.log(resp);
        setSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          setServicio(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.Service
          );
          setIdTicket(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.IDTicket
          );
          setNameTicket(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .CustomerVirtualName
          );
          setRoom(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .VirtualRoomName
          );
          setWs(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.WSSQuickTalk
          );
          setTurno(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties.Mnemonic +
              "-" +
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.Consecutive
          );
          getActualProcedureActionByProcedureImp(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .IDProcedureImp
          );
          console.log("Finalizo");
          setStep(3);
        } else {
          setSpinner(false);
          Toasty({
            type: "error",
            message: `No se pudo generar el ticket ${resp.DataBeanProperties.ErrorMessage}`,
          });
        }
      });
  };

  const onSubmit = () => {
    if (title === "Normal") {
      console.log("Normal");
      getAttentionTicket(
        null,
        serviceSelect,
        user.IDAccount,
        user.Nit,
        user.IDCharacterization,
        14
      );
      setStep(3);
    }
    if (title === "Tramite") {
      console.log("Tramite");
      getAttentionTicketAgenda(
        null,
        childsAgenda,
        user.IDAccount,
        user.Nit,
        user.IDCharacterization,
        14,
        availableAgenda
      );
      setStep(3);
    }
  };

  const handleAvailableAgenda = (data: any) => {
    console.log(data);
    setAvailableAgenda(data);
    getAttentionOfficeByAgendaRequest(data);
  };

  const handleOfficeAgenda = (data: any) => {
    console.log(data);
    setOfficeAgenda(data);
  };

  const switchRender = () => {
    switch (step) {
      case 0:
        return (
          <>
            <div className="container-ticket">
              <div
                className="form-calendar"
                style={{ margin: "50px auto", width: "60%" }}
              >
                <h1 className="text-center">
                  ATENCIÓN EN LÍNEA PARA INFORMACIÓN
                </h1>
                <div className="caja-input mt-5">
                  <label>¿En qué oficina deseas ser atendido?</label>
                  <div className="caja-input">
                    <Dropdown
                      className="select_ticket"
                      value={office}
                      options={list.map((item: any) => ({
                        label: item.DataBeanProperties.Name,
                        value: item.DataBeanProperties.IDAttentionOffice,
                      }))}
                      onChange={(e) => {
                        setOffice(e.value);
                        setFirstChild(null);
                        setListChild1([]);
                        setSecondChild(null);
                        setListChild2([]);
                        setThirdChild(null);
                        setListChild3([]);
                        setfourthChild(null);
                        setListChild4([]);
                        getOfficeChild(e.value, setListChild1);
                      }}
                      placeholder="Seleccione una oficina"
                    />
                  </div>

                  {listChild1.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3">
                        Elija el servicio al que desea acceder{" "}
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={firstChild}
                        options={listChild1}
                        onChange={(e) => {
                          setFirstChild(e.value);
                          setSecondChild(null);
                          setListChild2([]);
                          setThirdChild(null);
                          setListChild3([]);
                          setfourthChild(null);
                          setListChild4([]);
                          setServiceSelect(e.value);
                          getChild(setListChild2, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}

                  {/* oficinas */}

                  {listChild2.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3 ">
                        Elija un servicio de{" "}
                        <span className="text-capitalize">
                          {
                            listChild1.filter(
                              (item: any) => item.value === firstChild
                            )[0].label
                          }
                        </span>
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={secondChild}
                        options={listChild2}
                        onChange={(e) => {
                          setSecondChild(e.value);
                          setThirdChild(null);
                          setListChild3([]);
                          setfourthChild(null);
                          setListChild4([]);
                          setServiceSelect(e.value);
                          getChild(setListChild3, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}
                  {/* padre */}
                  {listChild3.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3">
                        Elija un servicio de{" "}
                        {camelize(
                          listChild2.filter(
                            (item: any) => item.value === secondChild
                          )[0].label
                        )}
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={thirdChild}
                        options={listChild3}
                        onChange={(e) => {
                          setThirdChild(e.value);
                          setfourthChild(null);
                          setListChild4([]);
                          setServiceSelect(e.value);
                          getChild(setListChild4, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}
                  {/* hijo */}
                  {listChild4.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3">
                        Elija un servicio de{" "}
                        {camelize(
                          listChild3.filter(
                            (item: any) => item.value === thirdChild
                          )[0].label
                        )}
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={fourthChild}
                        options={listChild4}
                        onChange={(e) => {
                          setfourthChild(e.value);
                          setServiceSelect(e.value);
                          getChild(setFifthChild, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}
                  {/* nieto */}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    className="mt-5 btn_request"
                    label="Solicitar Atención en Línea"
                    icon="pi pi-users"
                    iconPos="right"
                    style={{ width: "100%" }}
                    disabled={dsBtn}
                    onClick={() => {
                      setStep(2);
                      setTitle("Normal");
                    }}
                  ></Button>
                </div>
                <ConfirmDialog />
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <div className="container-ticket">
              <div
                className="form-calendar"
                style={{ margin: "50px auto", width: "60%" }}
              >
                <h1 className="text-center">
                  ATENCIÓN EN LÍNEA DE TRÁMITES RADICADOS Y APROBADOS
                </h1>
                <div className="caja-input mt-5">
                  <label>Elija el proceso que desea tramitar</label>
                  <div className="caja-input">
                    <Dropdown
                      className="select_ticket"
                      value={availableAgenda}
                      options={listAvailableAgenda.map((item: any) => ({
                        label: item.AlphaCode + " " + item.BusinessProcessName,
                        value: item.IDAgendaRequest,
                      }))}
                      onChange={(e) => {
                        setAvailableAgenda(e.value);
                        handleAvailableAgenda(e.value);
                      }}
                      placeholder="Seleccione un proceso"
                    />
                  </div>
                </div>
                <div className="caja-input mt-3">
                  <label>Elija la sucursal</label>
                  <div className="caja-input">
                    <Dropdown
                      className="select_ticket"
                      value={officeAgenda}
                      options={listOfficeAgenda.map((item: any) => ({
                        label: item.Name + " - " + item.Description,
                        value: item.IDAttentionOffice,
                      }))}
                      onChange={(e) => {
                        getAttentionIDChildsForAgendaRequest(
                          e.value,
                          availableAgenda
                        );
                        handleOfficeAgenda(e.value);
                      }}
                      placeholder="Seleccione una oficina"
                    />
                  </div>
                </div>
                <div className="caja-input mt-3">
                  <label>Elija el servicio al que desea acceder</label>
                  <div className="caja-input">
                    <Dropdown
                      className="select_ticket"
                      value={childsAgenda}
                      options={listChildsAgenda.map((item: any) => ({
                        label: item.Name,
                        value: item.IDLn,
                      }))}
                      onChange={(e) => {
                        setChildsAgenda(e.value);
                      }}
                      placeholder="Seleccione un servicio"
                    />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    className="mt-5 btn_request"
                    label="Solicitar Atención en Línea"
                    icon="pi pi-users"
                    iconPos="right"
                    style={{ width: "100%" }}
                    disabled={dsBtnRad}
                    onClick={() => {
                      setStep(2);
                      setTitle("Tramite");
                    }}
                  ></Button>
                </div>
              </div>
            </div>
            <div className="container-ticket">
              <div
                className="form-calendar"
                style={{ margin: "50px auto", width: "60%" }}
              >
                <h1 className="text-center">
                  ATENCIÓN EN LÍNEA PARA INFORMACIÓN
                </h1>
                <div className="caja-input mt-5">
                  <label>¿En qué oficina deseas ser atendido?</label>
                  <div className="caja-input">
                    <Dropdown
                      className="select_ticket"
                      value={office}
                      options={list.map((item: any) => ({
                        label: item.DataBeanProperties.Name,
                        value: item.DataBeanProperties.IDAttentionOffice,
                      }))}
                      onChange={(e) => {
                        setOffice(e.value);
                        setFirstChild(null);
                        setListChild1([]);
                        setSecondChild(null);
                        setListChild2([]);
                        setThirdChild(null);
                        setListChild3([]);
                        setfourthChild(null);
                        setListChild4([]);
                        getOfficeChild(e.value, setListChild1);
                      }}
                      placeholder="Seleccione una oficina"
                    />
                  </div>

                  {listChild1.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3">
                        Elija el servicio al que desea acceder{" "}
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={firstChild}
                        options={listChild1}
                        onChange={(e) => {
                          setFirstChild(e.value);
                          setSecondChild(null);
                          setListChild2([]);
                          setThirdChild(null);
                          setListChild3([]);
                          setfourthChild(null);
                          setListChild4([]);
                          setServiceSelect(e.value);
                          getChild(setListChild2, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}

                  {/* oficinas */}

                  {listChild2.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3 ">
                        Elija un servicio de{" "}
                        <span className="text-capitalize">
                          {
                            listChild1.filter(
                              (item: any) => item.value === firstChild
                            )[0].label
                          }
                        </span>
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={secondChild}
                        options={listChild2}
                        onChange={(e) => {
                          setSecondChild(e.value);
                          setThirdChild(null);
                          setListChild3([]);
                          setfourthChild(null);
                          setListChild4([]);
                          setServiceSelect(e.value);
                          getChild(setListChild3, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}
                  {/* padre */}
                  {listChild3.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3">
                        Elija un servicio de{" "}
                        {camelize(
                          listChild2.filter(
                            (item: any) => item.value === secondChild
                          )[0].label
                        )}
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={thirdChild}
                        options={listChild3}
                        onChange={(e) => {
                          setThirdChild(e.value);
                          setfourthChild(null);
                          setListChild4([]);
                          setServiceSelect(e.value);
                          getChild(setListChild4, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}
                  {/* hijo */}
                  {listChild4.length > 0 && (
                    <div className="fadeIn">
                      <label className="mt-3">
                        Elija un servicio de{" "}
                        {camelize(
                          listChild3.filter(
                            (item: any) => item.value === thirdChild
                          )[0].label
                        )}
                      </label>
                      <Dropdown
                        className="select_ticket"
                        value={fourthChild}
                        options={listChild4}
                        onChange={(e) => {
                          setfourthChild(e.value);
                          setServiceSelect(e.value);
                          getChild(setFifthChild, e.value);
                        }}
                        placeholder="Seleccione un servicio"
                      />
                    </div>
                  )}
                  {/* nieto */}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    className="mt-5 btn_request"
                    label="Solicitar Atención en Línea"
                    icon="pi pi-users"
                    iconPos="right"
                    style={{ width: "100%" }}
                    disabled={dsBtn}
                    onClick={() => {
                      setStep(2);
                      setTitle("Normal");
                    }}
                  ></Button>
                </div>
                <ConfirmDialog />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="infocard">
              <div className="infocard__logo">
                <img src={marcaAgua} alt="logo" />
              </div>
              <div className="infocard__cuerpo">
                <div className="infocard__cuerpo__nota mt-5">
                  <p className="infocard__cuerpo__nota__notaConfirmacion">
                    Hola{" "}
                    <b>
                      {camelize(user.Name1)} {camelize(user.Name2)}{" "}
                      {camelize(user.Surname1)} {camelize(user.Surname2)}
                    </b>
                    , para generar el turno se debe <b>Acceder a la Sala</b>.
                  </p>
                  <div className="infocard__note">
                    <div className="infocard__note__text">
                      <h2>Tenga en cuenta las siguientes recomendaciones:</h2>
                      <ul>
                        <li>
                          Tener la cédula o contraseña en físico para validación
                          de identidad.
                        </li>
                        <li>
                          Debe tener cámara y microfono habilitados para
                          brindarle una atención adecuada.
                        </li>
                        <li>
                          El asesor entrará a la llamada en el momento que tenga
                          disponibilidad.
                        </li>
                        <li>
                          Recuerde calificar el servicio al finalizar la
                          atención.
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="infocard__note">
                    <div className="infocard__note__text">
                      <h2>Nota:</h2>
                      <p style={{ textAlign: "justify" }}>
                        Para efectos de calidad del servicio, su llamada puede
                        ser grabada y monitoreada, debe aceptar los permisos del
                        navegador para iniciar la videollamada. Sus datos
                        personales serán tratados bajo principios de seguridad y
                        confidencialidad aplicables, con el propósito de ser
                        incluidos en nuestras bases de datos y propocionarle un
                        servicio de calidad.
                      </p>
                    </div>
                  </div>
                  <div className="infocard__cuerpo__infoContacto">
                    <h3>CAJA PROMOTORA DE VIVIENDA MILITAR Y POLICÍA</h3>
                    <h3>Centro de Contacto al Ciudadano: (601) 755 7070</h3>
                    <h3>
                      <strong>www.cajahonor.gov.co</strong> -{" "}
                      <strong>contactenos@cajahonor.gov.co</strong>
                    </h3>
                    <h3>Carrera 54 N°. 26-54 - Bogotá D.C. Colombia</h3>
                  </div>
                  <div className="infocard__cuerpo__footer mb-4">
                    <div className="infocard__footer">
                      <h4>
                        <b>BIENESTAR Y EXCELENCIA</b>
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                label="Acceder a la Sala"
                iconPos="right"
                icon="pi pi-arrow-up-right"
                className="infocard__boton"
                onClick={() => {
                  onSubmit();
                }}
              ></Button>
            </div>
          </>
        );
      case 3:
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
                icon=" pi pi-home"
                iconPos="left"
              ></Button>
            </div>
            {infoProcedure && <>
            
              <div className="row mt-3">
              <div className="col-6 text-center" style={{fontSize:20}}>
              <strong>Servicio: </strong>{infoProcedure.BusinessProcessName}
              </div>
              <div className="col-6 text-center" style={{fontSize:20}}>
              <strong>Código de Radicación:</strong> {infoProcedure.AlphaCode}
              </div>
            </div>
            </>}
            <MCall
              show={showDialog}
              setShow={setShowDialog}
              name={nameTicket}
              room={room}
              ws={ws}
              tipo="cliente"
              turno={turno}
              idTicket={idTicket}
            />
          </>
        );
    }
  };

  return <>{switchRender()}</>;
};
