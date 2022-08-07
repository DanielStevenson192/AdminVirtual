import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { AdminService } from "../../core/services/AdminService";
import {
  formatDate,
  formatDay,
  formatMont,
} from "../../core/shared/FormatDate";
import { AppointmentInfo } from "../../core/services/model/appoiment-info.interface";
import { Appointment } from "../../core/services/model/appointment.interface";
import { Pair } from "../../core/services/model/pair.interface";
import { addLocale } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { ToastAlert } from "../../core/Components/Toast";
import { Col, Row } from "react-bootstrap";
import { TreeSelect } from "primereact/treeselect";
import { FC } from "react";
import imageWatermark from "../../assets/img/home-01.png";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { Spinner } from "../../core/shared/Spinner";
import iconPresencial from "../../assets/icon-cards/icono-presencial.svg";
import iconHora from "../../assets/icon-cards/icono-hora.svg";
import iconLugar from "../../assets/icon-cards/icono-lugar.svg";
import iconDisponible from "../../assets/icon-cards/icono-disponible.svg";
import iconoAsesores from "../../assets/icon-cards/icono-asesores.svg";
import iconoFecha from "../../assets/icon-cards/icono-fecha.svg";
import { stringify } from "querystring";
import { TrayService } from "../../core/services/TrayService";

const _adminService = new AdminService();
const _trayService = new TrayService();

interface Props {
  setSpinner: any;
}

const festivos = [
  '01/1',
  '06/1',
  '10/1',
  '28/2',
  '21/3',
  '14/4',
  '01/5',
  '30/5',
  '20/6',
  '27/6',
  '04/7',
  '20/7',
  '07/8',
  '15/8',
  '17/10',
  '07/11',
  '14/11',
  '08/12',
  '25/12']
export const FormDiary: FC<Props> = ({ setSpinner }) => {
  const [typeAtencion, settypeAtencion] = useState<any>({});
  const [listTree, setListTree] = useState<any>([]);
  const [office, setOffice] = useState<number>();
  const [list, setList] = useState([]);
  const [arrayFechas2, setArrayFechas2] = useState<any>([]);
  const [hour, setHours] = useState<any>([]);
  const [monthCurrent, setMonthCurrent] = useState<any>(new Date());
  const [showCitas, setShowCitas] = useState(false);
  const [user, setUser] = useState<any>({});
  const [change, setChange] = useState(false);
  const [ID, setID] = useState(0);
  const [showALert, setShowALert] = useState(false);
  const { Toasty } = ToastAlert();
  const [valueDate, setvalueDate] = useState<any>(null);
  const [getDate, setGetDate] = useState<any>();
  const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
  const minDate = new Date(new Date());
  const [messageDate, setMessageDate] = useState(false);
  const [state, setState] = useState(0);
  const [objAssign, setObjAssign] = useState<any>({});
  const [showSpinner, setShowSpinner] = useState(false);
  const navigate = useNavigate();
  const [value1, setValue1] = useState<boolean>(true);
  const [value2, setValue2] = useState<boolean>(false);
  const [temp, setTemp] = useState<any>(null);
  const [showState, setShowState] = useState(false);
  const [cadena, setCadena] = useState<string>("");
  const [boton, setBoton] = useState(false);
  const [listNot, setListNot] = useState<any>([]);
  const typesCares = [
    { name: "Presencial", type: 13 },
    { name: "Virtual", type: 14 },
  ];
  const [listAvailableAgenda, setListAvailableAgenda] = useState<any[]>([]);
  const [availableAgenda, setAvailableAgenda] = useState(0);
  const [listOfficeAgenda, setListOfficeAgenda] = useState<any[]>([]);
  const [officeAgenda, setOfficeAgenda] = useState(0);
  const [listChildsAgenda, setListChildsAgenda] = useState<any[]>([]);
  const [childsAgenda, setChildsAgenda] = useState(0);
  const [title, setTitle] = useState<any>(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties);
    getAvailableAgendaRequestCatalog(JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties.IDAccount);


  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowCitas(true);
      setSpinner(false);
    }, 1500);
  }, [hour]);


  //VALIDA LOS SELECTORES
  useEffect(() => {
    validarSelectores();
  }, []);



  const validarSelectores = () => {

    if (localStorage.getItem('TipoAtencion')) {
      const campo1 = JSON.parse(localStorage.getItem("TipoAtencion") ?? "");
      settypeAtencion(campo1)
    }

    if (localStorage.getItem('Office')) {
      const campo2 = JSON.parse(localStorage.getItem("Office") ?? "");
      setOffice(campo2)

    }


    if (localStorage.getItem('Service')) {
      const campo3 = JSON.parse(localStorage.getItem("Service") ?? "");
      setSelectedNodeKey(campo3);
    }


    if (localStorage.getItem('listaServices')) {
      const campo4 = JSON.parse(localStorage.getItem("listaServices") ?? "");
      setListTree(campo4);

    }

    if (localStorage.getItem('date')) {
      const dateCurrent = new Date();
      const campo5 = JSON.parse(localStorage.getItem("date") ?? "");
      setID(campo5)
      getAvailableAppointment(
        dateCurrent.getFullYear(),
        dateCurrent.getMonth() + 1,
        campo5
      );

    }


  }



  useEffect(() => {
    _adminService
      .getAttentionOfficeCatalogByChannelType(typeAtencion.type)
      .subscribe((res) => {
        setList(res.DataBeanProperties.ObjectValue);
      });
  }, [typeAtencion]);

  const getAssign = (data: any) => {
    console.log(title);
    if (title === "Normal") {
      setSpinner(true);
      _adminService
        .assignAppointmentAgenda(
          data.IDAttentionTime,
          data.FromDate,
          data.QuotaNumber,
          user.IDAccount,
          null,
          typeAtencion.type,
          user.IDCharacterization,
          null
        )
        .subscribe((resp: any) => {
          console.log(resp);
          if (resp.DataBeanProperties.ObjectValue) {
            if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.FromDate) {
              const auxHourInit = new Date(
                resp.DataBeanProperties.ObjectValue.DataBeanProperties.FromDate
              );
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myDay =
                formatDay(auxHourInit.getDay());
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myMonth =
                formatMont(auxHourInit.getMonth() + 1);
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myYear =
                auxHourInit.getFullYear();
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myHour =
                (auxHourInit.getHours() < 10 ? "0" : "") +
                auxHourInit.getHours() +
                ":" +
                (auxHourInit.getMinutes() < 10 ? "0" : "") +
                auxHourInit.getMinutes() +
                " " +
                (auxHourInit.getHours() < 12 ? "AM" : "PM");
            }
            if (
              resp.DataBeanProperties.ObjectValue.DataBeanProperties
                .ChannelType === 14
            ) {
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myNameChannel =
                "CANAL DE ATENCIÓN VIRTUAL";
            } else {
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myNameChannel =
                "CANAL DE ATENCIÓN PRESENCIAL";
            }
            setObjAssign({ ...resp.DataBeanProperties.ObjectValue });
            Toasty({ type: "success", message: "Cita asignada" });
            setSpinner(false);
            setState(3);
            setCadena(
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myNameChannel
            );
          } else {
            setSpinner(false);
            Toasty({
              type: "error",
              message: "ESTA CITA YA NO SE ENCUENTRA DISPONIBLE",
            });
          }
        });
    }
    if (title === "Tramite") {
      setSpinner(true);
      _adminService
        .assignAppointmentAgenda(
          data.IDAttentionTime,
          data.FromDate,
          data.QuotaNumber,
          user.IDAccount,
          null,
          typeAtencion,
          user.IDCharacterization,
          availableAgenda
        )
        .subscribe((resp: any) => {
          console.log(resp);
          if (resp.DataBeanProperties.ObjectValue) {
            if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.FromDate) {
              const auxHourInit = new Date(
                resp.DataBeanProperties.ObjectValue.DataBeanProperties.FromDate
              );
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myDay =
                formatDay(auxHourInit.getDay());
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myMonth =
                formatMont(auxHourInit.getMonth() + 1);
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myYear =
                auxHourInit.getFullYear();
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myHour =
                (auxHourInit.getHours() < 10 ? "0" : "") +
                auxHourInit.getHours() +
                ":" +
                (auxHourInit.getMinutes() < 10 ? "0" : "") +
                auxHourInit.getMinutes() +
                " " +
                (auxHourInit.getHours() < 12 ? "AM" : "PM");
            }
            if (
              resp.DataBeanProperties.ObjectValue.DataBeanProperties
                .ChannelType === 14
            ) {
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myNameChannel =
                "CANAL DE ATENCIÓN VIRTUAL";
            } else {
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myNameChannel =
                "CANAL DE ATENCIÓN PRESENCIAL";
            }
            setObjAssign({ ...resp.DataBeanProperties.ObjectValue });
            Toasty({ type: "success", message: "Cita asignada" });
            setSpinner(false);
            setState(3);
            setCadena(
              resp.DataBeanProperties.ObjectValue.DataBeanProperties.myNameChannel
            );
          } else {
            setSpinner(false);
            Toasty({
              type: "error",
              message: "ESTA CITA YA NO SE ENCUENTRA DISPONIBLE",
            });
          }
        });
    }

  };

  const handleService = (IDAttentionOffice: number) => {
    setOffice(IDAttentionOffice);
    getTree(IDAttentionOffice, null);
  };

  const getTree = (idOffice: number, idCharacterization: any) => {
    setSpinner(true);
    listTree.splice(0, listTree.length);

    _adminService
      .getTree(idOffice, idCharacterization)
      .subscribe((resp: any) => {
        if (resp.DataBeanProperties.ObjectValue) {
          setSpinner(false);

          resp.DataBeanProperties.ObjectValue.Childs.forEach((element: any) => {
            element.EnvolvedObject.DataBeanProperties.label =
              element.EnvolvedObject.DataBeanProperties.Name;
            element.EnvolvedObject.DataBeanProperties.key =
              element.EnvolvedObject.DataBeanProperties.IDLn;
            if (element.Childs.length > 0) {
              element.EnvolvedObject.DataBeanProperties.selectable = false;
              element.Childs.forEach((element2: any) => {
                element2.label =
                  element2.EnvolvedObject.DataBeanProperties.Name;
                element2.key = element2.EnvolvedObject.DataBeanProperties.IDLn;

                if (element2.Childs.length > 0) {
                  element2.selectable = false;
                  element2.Childs.forEach((element3: any) => {
                    element3.label =
                      element3.EnvolvedObject.DataBeanProperties.Name;
                    element3.key =
                      element3.EnvolvedObject.DataBeanProperties.IDLn;
                  });
                  element2.children = element2.Childs;
                }
              });
              element.EnvolvedObject.DataBeanProperties.children =
                element.Childs;
            }
            listTree.push(element.EnvolvedObject.DataBeanProperties);
            localStorage.setItem("listaServices", JSON.stringify(listTree));
          });
        }
      });

    localStorage.setItem("listaServices", JSON.stringify(listTree));
  };

  /* const aux2: any = `${new Date(e.value).getDate()}/${new Date(e.value).getMonth() + 1
  }`;
if (festivos.includes(aux2)) {
  Toasty({
    type: "warning",
    message: `No hay citas disponibles en dias festivos`,
  });
  setBoton(true);
} else {
  setGetDate(e);
  valideDate(e.value);
  setBoton(false);
} */

  const getAvailableAppointment = (anio: any, month: number, idLn: number) => {

    listNot.splice(0, listNot.length);
    console.log(anio, month, idLn);
    setSpinner(true);
    _adminService
      .getAvailableAppointment(anio, month, idLn)
      .subscribe((resp) => {
        console.log(resp);
        if (resp.length > 0) {
          resp.forEach((element: any) => {
            if (element.Date) {
              element.myDate = new Date(element.Date.replaceAll("-", "/"));
              if (element.Quotes === 0) {
                listNot.push(element.myDate);
              } else {
                const temp = new Date(element.Date);
                const aux2 = (temp.getDate() + 1) + "/" + (temp.getMonth() + 1);
                if (festivos.includes(aux2)) {
                  listNot.push(element.myDate);
                  element.myConfirm = true;
                } else {
                  element.myConfirm = false;
                }
              }
            }
          });
          setSpinner(false);
          setArrayFechas2(resp);
        } else {
          Toasty({
            type: "error",
            message: "Hubo un error al iniciar la llamada",
          });
        }
      });
  };

  const getChange = (e: any) => {
    setChange(!change);
    setMonthCurrent(formatDate(e.value));
    const newDate = new Date(formatDate(e.value));
    getAvailableAppointment(newDate.getFullYear(), newDate.getMonth() + 1, ID);
  };

  const getSelect = (date: any) => {

    console.log("BUSCAR CITAAA", date);
    console.log("ID", ID);
    const auxDate = new Date(monthCurrent);
    const tempDate =
      auxDate.getFullYear() +
      "-" +
      (auxDate.getMonth() + 1) +
      "-" +
      date.originalEvent.target.textContent;
    _adminService
      .getAppointments(ID, tempDate + " 00:00:00")
      .subscribe((resp) => {
        console.log('getAppoiment', resp);
        setHours(resp)
        if (resp) {
          if (resp.length > 0) {
            const current = new Date();
            resp.forEach((element: Appointment): any => {
              _adminService.getAppointmentConstants().subscribe((respC) => {
                if (element.FromDate) {
                  const auxHourInit = new Date(element.FromDate);
                  element.myHour =
                    (auxHourInit.getHours() < 10 ? "0" : "") +
                    auxHourInit.getHours() +
                    ":" +
                    (auxHourInit.getMinutes() < 10 ? "0" : "") +
                    auxHourInit.getMinutes() +
                    " " +
                    (auxHourInit.getHours() < 12 ? "AM" : "PM");
                  const auxHourFinal = new Date(element.UntilDate);
                  element.myHour2 =
                    (auxHourFinal.getHours() < 10 ? "0" : "") +
                    auxHourFinal.getHours() +
                    ":" +
                    (auxHourFinal.getMinutes() < 10 ? "0" : "") +
                    auxHourFinal.getMinutes() +
                    " " +
                    (auxHourFinal.getHours() < 12 ? "AM" : "PM");
                  element.myDate = formatDate(new Date(tempDate));
                  const tempState = respC.findIndex(
                    (item: Pair) => element.State === item.Value
                  );
                  element.myState = respC[tempState].Property;
                }
              });
            });
            setState(2);
          } else {
            Toasty({
              type: "warning",
              message: "No hay citas para este día",
            });
            setSpinner(false);
          }
        }
      });
  };

  async function MostrarCitas() {
    getSelect(getDate);
    setSpinner(true);
    /* if (typeAtencion.type && office && selectedNodeKey) {
      getSelect(getDate);
      setSpinner(true);
    } else {
      setShowALert(true);
    } */
  }

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

  const dateTemplate = (date: any) => {
    const aux = new Date(monthCurrent);
    const dateCurrent = new Date(minDate);
    if (
      dateCurrent.getFullYear() <= date.year &&
      dateCurrent.getMonth() + 1 <= date.month + 1
    ) {
      if (
        date.day > 0 &&
        date.day < 32 &&
        date.month + 1 === aux.getMonth() + 1
      ) {
        const temp = arrayFechas2.findIndex(
          (item: AppointmentInfo) => date.day === item.Day && item.Quotes === 0
        );
        const temp2 = arrayFechas2.findIndex(
          (item: AppointmentInfo) =>
            date.day === item.Day && item.Quotes > 0 && item.Quotes < 22
        );
        if (temp === -1) {
          if (temp2 === -1) {
            setMessageDate(false);
            return (
              <div
                style={{
                  backgroundColor: "#0F1F67",
                  color: "#ffffff",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  width: "2em",
                  height: "2em",
                  lineHeight: "2em",
                  textAlign: "center",
                  padding: 0,
                }}
              >
                {date.day}
              </div>
            );
          } else {
            setMessageDate(false);
            return (
              <div
                style={{
                  backgroundColor: "orange",
                  color: "#ffffff",
                  fontWeight: "bold",
                  borderRadius: "50%",
                  textAlign: "center",
                  width: "2em",
                  height: "2em",
                  lineHeight: "2em",
                  padding: 0,
                }}
              >
                {date.day}
              </div>
            );
          }
        } else {
          setMessageDate(true);
          return date.day;
        }
      } else {
        return date.day;
      }
    } else {
      return date.day;
    }
  };

  const getCalendar = (e: any) => {
    console.log(e.value);
    setSelectedNodeKey(e.value);
    const dateCurrent = new Date();
    setMonthCurrent(new Date());
    setID(e.value);
    localStorage.setItem("date", JSON.stringify(e.value));
    getAvailableAppointment(
      dateCurrent.getFullYear(),
      dateCurrent.getMonth() + 1,
      e.value
    );
  };

  const getCalendarAgenda = (e: any) => {
    console.log(e.value);
    setChildsAgenda(e.value);
    const dateCurrent = new Date();
    setMonthCurrent(new Date());
    setID(e.value);
    localStorage.setItem("date", JSON.stringify(e.value));
    getAvailableAppointment(
      dateCurrent.getFullYear(),
      dateCurrent.getMonth() + 1,
      e.value
    );
  };

  const valideDate = (data: any) => {
    setTemp(data);
    setvalueDate(data);
  };

  const resetDate = () => {
    if (title === 'Tramite') {
      setState(1);
    } else {
      setState(0);
    }
    setvalueDate(temp);
  };

  const focus1 = () => {
    setValue1(true);
    setValue2(false);
  };

  const focus2 = () => {
    setValue2(true);
    setValue1(false);
  };

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

  const getAvailableAgendaRequestCatalog = (idAccount: any) => {
    setSpinner(true);
    _adminService
      .getAvailableAgendaRequestCatalog(idAccount)
      .subscribe((resp: any) => {
        setSpinner(false);
        if (resp) {
          if (resp.length > 0) {
            setState(1);
            setListAvailableAgenda(resp);
          } else {
            setState(0);
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
        console.log(resp);
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

  const getAttentionIDChildsForAgendaRequest = (idAttentionOffice: any, idAgendaRequest: any) => {
    setSpinner(true);
    _adminService
      .getAttentionIDChildsForAgendaRequest(idAttentionOffice, idAgendaRequest)
      .subscribe((resp: any) => {
        console.log(resp);
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

  const handleAvailableAgenda = (data: any) => {
    console.log(data);
    setAvailableAgenda(data);
    getAttentionOfficeByAgendaRequest(data);
  }

  const handleOfficeAgenda = (data: any) => {
    console.log(data);
    /* settypeAtencion(); */


    /* setOfficeAgenda(data.IDAttentionOffice);
    if(data.PhysicalChannel){
      settypeAtencion(13);
    } else {
      settypeAtencion(14);
    }
    getAttentionIDChildsForAgendaRequest(availableAgenda, data.IDAttentionOffice); */
    setOfficeAgenda(data);
    console.log(data, availableAgenda);
    getAttentionIDChildsForAgendaRequest(data, availableAgenda);
    _adminService.getAttentionOffice(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.DataBeanProperties.ObjectValue) {
        if (resp.DataBeanProperties.ObjectValue.DataBeanProperties.PhysicalChannel) {
          settypeAtencion(13);
        } else {
          settypeAtencion(14);
        }
      } else {

      }
    });
  }

  const handleChildsAgenda = (data: any) => {
    console.log(data);
    setChildsAgenda(data);
  }

  const renderSwitch = () => {
    switch (state) {
      case 0:
        return (
          <>
            <Row className="container-calendar">
              <Col className="caja-1 mt-5">
                <div className="form-calendar">
                  <h1 className="text-center mb-5">AGENDAR CITA PARA INFORMACIÓN</h1>
                  <div className="caja-input">
                    <label>Tipo de atención</label>
                    <Dropdown
                      optionLabel="name"
                      value={typeAtencion}
                      options={typesCares}
                      onChange={(e) => {
                        settypeAtencion(e.value);
                        localStorage.setItem("TipoAtencion", JSON.stringify(e.value));
                        localStorage.setItem("Office", "");
                        localStorage.setItem("listaServices", "");
                        localStorage.setItem("Service", "");
                        setListTree([]);
                        setSelectedNodeKey(null);
                      }}
                      className="select-calendar"
                      placeholder="Seleccione un tipo de atención"
                    />
                    {showALert && !typeAtencion.type && (
                      <span className="message-input">Campo requerido</span>
                    )}
                    <div className="caja-input">
                      <label>Oficina de atención</label>
                      <Dropdown
                        className="select-calendar"
                        value={office}
                        options={list.map((item: any) => ({
                          label: item.DataBeanProperties.Name + (item.DataBeanProperties.Description ? " - " + item.DataBeanProperties?.Description : ""),
                          value: item.DataBeanProperties.IDAttentionOffice,
                        }))}
                        onChange={(e) => {
                          handleService(e.value);
                          localStorage.setItem("Office", JSON.stringify(e.value));
                          localStorage.setItem("Service", "");

                        }}
                        placeholder="Seleccione una oficina"
                      />
                      {showALert && !office && (
                        <span className="message-input">Campo requerido</span>
                      )}
                    </div>
                    <div className="caja-input">
                      <label>Servicios</label>
                      <TreeSelect
                        value={selectedNodeKey}
                        options={listTree}
                        onChange={(e) => {
                          getCalendar(e);
                          localStorage.setItem("Service", JSON.stringify(e.value));
                          localStorage.setItem("listaServices", JSON.stringify(listTree));
                        }}
                        placeholder="Seleccione un servicio"
                        className="select-calendar"
                      ></TreeSelect>
                      {showALert && !selectedNodeKey && (
                        <span className="message-input">Campo requerido</span>
                      )}
                    </div>
                    {selectedNodeKey && (
                      <div className="caja-input">
                        <label>Fecha de cita</label>
                        <br></br>
                        <Calendar
                          id="icon"
                          dateFormat="dd/mm/yy"
                          value={valueDate}
                          viewDate={new Date(monthCurrent)}
                          dateTemplate={dateTemplate}
                          locale={"es"}
                          minDate={minDate}
                          className="select-citas"
                          showIcon
                          onFocus={() => {
                            setShowState(true);
                          }}
                          onChange={(e: any) => {
                            setGetDate(e);
                            valideDate(e.value);
                            setBoton(false);
                          }}
                          readOnlyInput={true}
                        />
                        <section>
                          <p className="mt-2">Estado de las fechas</p>
                          <div className="container-circulos">
                            <span className="ciculo-verde"></span>
                            <span>Disponible</span>
                          </div>
                          <div className="container-circulos">
                            <span className="ciculo-amarillo"></span>
                            <span>Escasos</span>
                          </div>
                        </section>
                      </div>
                    )}
                    <Button
                      type="button"
                      label="Buscar Citas"
                      className="btn-calendar"
                      icon="pi pi-search"
                      iconPos="right"
                      onClick={() => { MostrarCitas(); setTitle("Normal") }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        );
      case 1:
        return (
          <>
            <Row className="container-calendar">
              <Col className="caja-1 mt-5">
                <div className="form-calendar">
                  <h1 className="text-center mb-5">AGENDAR CITA DE RADICADOS Y APROBADOS</h1>
                  <div className="caja-input mt-5">
                    <label>Elija el proceso que desea tramitar</label>
                    <Dropdown
                      className="select_ticket"
                      value={availableAgenda}
                      options={listAvailableAgenda.map((item: any) => ({
                        label: item.AlphaCode + " " + item.BusinessProcessName,
                        value: item.IDAgendaRequest,
                      }))}
                      onChange={(e) => handleAvailableAgenda(e.value)}
                      placeholder="Seleccione un proceso"
                    />
                  </div>
                  <div className="caja-input">
                    <label>Oficina de atención</label>
                    <Dropdown
                      className="select_ticket"
                      value={officeAgenda}
                      options={listOfficeAgenda.map((item: any) => ({
                        label: item.Name + " - " + item.Description,
                        value: item.IDAttentionOffice,
                      }))}
                      onChange={(e) => handleOfficeAgenda(e.value)}
                      placeholder="Seleccione una oficina"
                    />
                  </div>
                  <div className="caja-input">
                    <label>Servicios</label>
                    <Dropdown
                      className="select_ticket"
                      value={childsAgenda}
                      options={listChildsAgenda.map((item: any) => ({
                        label: item.Name,
                        value: item.IDLn,
                      }))}
                      onChange={(e) => getCalendarAgenda(e)}
                      placeholder="Seleccione un servicio"
                    />
                  </div>
                  <div className="caja-input">
                    <label>Fecha de cita</label>
                    <br></br>
                    <Calendar
                      id="icon"
                      dateFormat="dd/mm/yy"
                      value={valueDate}
                      viewDate={new Date(monthCurrent)}
                      dateTemplate={dateTemplate}
                      locale={"es"}
                      minDate={minDate}
                      className="select-citas"
                      showIcon
                      onFocus={() => {
                        setShowState(true);
                      }}
                      onChange={(e: any) => {
                        setGetDate(e);
                        valideDate(e.value);
                        setBoton(false);
                      }}
                      readOnlyInput={true}
                    />
                    <section>
                      <p className="mt-2">Estado de las fechas</p>
                      <div className="container-circulos">
                        <span className="ciculo-verde"></span>
                        <span>Disponible</span>
                      </div>
                      <div className="container-circulos">
                        <span className="ciculo-amarillo"></span>
                        <span>Escasos</span>
                      </div>
                    </section>
                  </div>
                  <Button
                    type="button"
                    label="Buscar Citas"
                    className="btn-calendar"
                    icon="pi pi-search"
                    iconPos="right"
                    onClick={() => { MostrarCitas(); setTitle("Tramite") }}
                  />
                </div>
              </Col>
            </Row>
            <Row className="container-calendar">
              <Col className="caja-1 mt-5">
                <div className="form-calendar">
                  <h1 className="text-center mb-5">AGENDAR CITA PARA INFORMACIÓN</h1>
                  <div className="caja-input">
                    <label>Tipo de atención</label>
                    <Dropdown
                      optionLabel="name"
                      value={typeAtencion}
                      options={typesCares}
                      onChange={(e) => { settypeAtencion(e.value); localStorage.setItem("TipoAtencion", JSON.stringify(typeAtencion)) }}
                      className="select-calendar"
                      placeholder="Seleccione un tipo de atención"
                    />
                    {showALert && !typeAtencion.type && (
                      <span className="message-input">Campo requerido</span>
                    )}
                    <div className="caja-input">
                      <label>Oficina de atención</label>
                      <Dropdown
                        className="select-calendar"
                        value={office}
                        options={list.map((item: any) => ({
                          label: item.DataBeanProperties.Name + (item.DataBeanProperties.Description ? " - " + item.DataBeanProperties?.Description : ""),
                          value: item.DataBeanProperties.IDAttentionOffice,
                        }))}
                        onChange={(e) => {
                          handleService(e.value);
                        }}
                        placeholder="Seleccione una oficina"
                      />
                      {showALert && !office && (
                        <span className="message-input">Campo requerido</span>
                      )}
                    </div>
                    <div className="caja-input">
                      <label>Servicios</label>
                      <TreeSelect
                        value={selectedNodeKey}
                        options={listTree}
                        onChange={(e) => getCalendar(e)}
                        placeholder="Seleccione un servicio"
                        className="select-calendar"
                      ></TreeSelect>
                      {showALert && !selectedNodeKey && (
                        <span className="message-input">Campo requerido</span>
                      )}
                    </div>
                    {selectedNodeKey && (
                      <div className="caja-input">
                        <label>Fecha de cita</label>
                        <br></br>
                        <Calendar
                          id="icon"
                          dateFormat="dd/mm/yy"
                          value={valueDate}
                          viewDate={new Date(monthCurrent)}
                          dateTemplate={dateTemplate}
                          locale={"es"}
                          minDate={minDate}
                          className="select-citas"
                          showIcon
                          onFocus={() => {
                            setShowState(true);
                          }}
                          onChange={(e: any) => {
                            setGetDate(e);
                            valideDate(e.value);
                            setBoton(false);
                          }}
                          readOnlyInput={true}
                        />
                        <section>
                          <p className="mt-2">Estado de las fechas</p>
                          <div className="container-circulos">
                            <span className="ciculo-verde"></span>
                            <span>Disponible</span>
                          </div>
                          <div className="container-circulos">
                            <span className="ciculo-amarillo"></span>
                            <span>Escasos</span>
                          </div>
                        </section>
                      </div>
                    )}
                    <Button
                      type="button"
                      label="Buscar Citas"
                      className="btn-calendar"
                      icon="pi pi-search"
                      iconPos="right"
                      onClick={() => { MostrarCitas(); setTitle("Normal") }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </>
        );

      case 2:
        return (
          <Col className="caja-form">
            <div className="container-boton">
              <div className="caja-padre-vista-2">
                <Button
                  label="Atrás"
                  iconPos="left"
                  icon="pi pi-arrow-left"
                  className="btn-atras"
                  onClick={() => {
                    setState(0);
                    setHours([]);
                    setShowCitas(false);
                    resetDate();
                  }}
                />
                <div style={{ display: "flex" }}>
                  <button
                    className="btn-diseño-1"
                    onClick={focus1}
                    data-focus={value1}
                  >
                    <i className="pi pi-table" style={{ fontSize: "20px" }}></i>
                  </button>
                  <button
                    className="btn-diseño-2"
                    onClick={focus2}
                    data-focus={value2}
                  >
                    <i
                      className="pi pi-microsoft"
                      style={{ fontSize: "20px" }}
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            {value1 ? (
              <div className="card">
                <DataTable
                  className="table-turn"
                  value={hour}
                  paginator
                  responsiveLayout="scroll"
                  paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                  currentPageReportTemplate="Mostrando {first} hasta {last} de {totalRecords} citas disponibles"
                  rows={10}
                  rowsPerPageOptions={[10, 20, 50]}
                >
                  <Column
                    className="fila-fecha"
                    field="myDate"
                    header="Fecha de la cita"
                  ></Column>
                  <Column
                    className="fila-hora"
                    body={(data) => {
                      return (
                        <p>
                          {data.myHour} - {data.myHour2}
                        </p>
                      );
                    }}
                    header="Hora de la cita"
                  ></Column>
                  <Column
                    className="fila-atencion"
                    body={typeAtencion.name}
                    header="Tipo de atención"
                  ></Column>
                  <Column
                    field="myState"
                    header="Estado"
                    style={{ texAling: "center" }}
                  ></Column>
                  <Column
                    body={(e: any) => {
                      return (
                        <Button
                          onClick={() => {
                            getAssign(e);
                          }}
                          className="mt-1 btn-asignar-cita"
                          label="Agendar cita"
                          icon="pi pi-check "
                          style={{
                            padding: "5px 15px",
                            display: "block",
                            border: "none",
                            position: "relative",
                            top: "10px",
                          }}
                        />
                      );
                    }}
                    header="Acciones"
                  ></Column>
                </DataTable>
              </div>
            ) : showCitas ? (
              hour.length > 0 ? (
                <section className="container-card-agendar-cita">
                  {hour.map((item: any, index: number) => (
                    <div className="card-agendar-cita" key={index}>
                      <div className="cajita">
                        <div className="btn-icono mt-2 mr-2">
                          <img
                            src={iconDisponible}
                            width={50}
                            height={50}
                          ></img>
                        </div>
                        <span> {item.myState}</span>
                      </div>
                      <div className="cajita">
                        <div className="btn-icono mt-2 mr-2">
                          <img
                            src={iconoAsesores}
                            width={50}
                            height={50}
                          ></img>
                        </div>
                        <span>
                          Asesores Disponibles: {item.AdvisorNumberAvailable}
                        </span>
                      </div>
                      <div className="cajita">
                        <div className="btn-icono mt-2 mr-2">
                          <img src={iconoFecha} width={50} height={50}></img>
                        </div>
                        <span>{item.myDate}</span>
                      </div>
                      <div className="cajita">
                        <div className="btn-icono mt-2 mr-2">
                          <img src={iconHora} width={50} height={50}></img>
                        </div>
                        <span>
                          {" "}
                          {item.myHour} - {item.myHour2}
                        </span>
                      </div>
                      <div className="cajita">
                        <div className="btn-icono mt-2 mr-2">
                          <img src={iconLugar} width={50} height={50}></img>
                        </div>
                        <span>Caja honor</span>
                      </div>
                      <div className="cajita">
                        <div className="btn-icono mt-2 mr-2">
                          <img
                            src={iconPresencial}
                            width={50}
                            height={50}
                          ></img>
                        </div>
                        <span> {typeAtencion.name}</span>
                      </div>
                      <Button
                        onClick={() => {
                          getAssign(item);
                        }}
                        className="mt-1 btn-asignar-cita"
                        label="Agendar cita"
                        icon="pi pi-check "
                        style={{
                          padding: "5px 15px",
                          width: "100%",
                          display: "block",
                          backgroundColor: "#fec917",
                          border: "none",
                          position: "relative",
                          top: "10px",
                        }}
                      />
                    </div>
                  ))}
                </section>
              ) : (
                <div className="p-5">
                  <h1>No hay citas para esta fecha</h1>
                </div>
              )
            ) : (
              <div className="padre-loader"></div>
            )}
          </Col>
        );

      case 3:
        return (
          <>
            <Row className="letter">
              <Col sm={12} className="letter_text">
                <div className="letter_check">
                  <i className="pi pi-check-circle"></i>
                </div>
                <div className="letter_watermark_diary">
                  <img src={imageWatermark} alt="watermark" />
                </div>
                {objAssign.DataBeanProperties.ChannelType === 14 ?
                  <>
                    <h1>La cita ha sido agendada</h1>
                    <h2>
                      Hola <b>{camelize(user.Name1)} {camelize(user.Name2)} {camelize(user.Surname1)} {camelize(user.Surname2)}</b>,
                      tiene una cita por concepto de{" "}
                      <b>{objAssign.DataBeanProperties.myNameChannel.toLowerCase()} </b>
                      para el{" "}
                      <b>
                        día {objAssign.DataBeanProperties.myDay.toLowerCase()}{" "}
                        {objAssign.DataBeanProperties.DayOfMonth} de{" "}
                        {objAssign.DataBeanProperties.myMonth},{" "}
                        {objAssign.DataBeanProperties.myYear} a las{" "}
                        {objAssign.DataBeanProperties.myHour}
                      </b>
                      .
                    </h2>
                    <h2>Tenga en cuenta las siguientes recomendaciones:</h2>
                    <ul>
                      <li>
                        Tener la cédula o contraseña en físico para validación de identidad.
                      </li>
                      <li>
                        Debe tener cámara y microfono habilitados para brindarle
                        una atención adecuada.
                      </li>
                      <li>
                        Podrá acceder 5 minutos antes de lo programado a la cita.
                      </li>
                      <li>
                        El asesor entrará a la llamada en el momento que tenga
                        disponibilidad.
                      </li>
                      <li>
                        Recuerde calificar el servicio al finalizar la atención.
                      </li>

                    </ul>

                    <h2>Nota:</h2>
                    <p style={{ textAlign: "justify" }}>
                      Para efectos de calidad del servicio, su llamada puede ser
                      grabada y monitoreada, debe aceptar los permisos del
                      navegador para iniciar la videollamada. Sus datos personales
                      serán tratados bajo principios de seguridad y
                      confidencialidad aplicables, con el propósito de ser
                      incluidos en nuestras bases de datos y propocionarle un
                      servicio de calidad.
                    </p>

                    <div className="letter_pre_footer">
                      <h3>CAJA PROMOTORA DE VIVIENDA MILITAR Y POLICÍA</h3>
                      <h3>Centro de Contacto al Ciudadano: (601) 755 7070</h3>
                      <h3>
                        <strong>www.cajahonor.gov.co</strong> -{" "}
                        <strong>contactenos@cajahonor.gov.co</strong>
                      </h3>
                      <h3>Carrera 54 N°. 26-54 - Bogotá D.C. Colombia</h3>
                    </div>

                    <div className="letter_footer">
                      <h4><b>BIENESTAR Y EXCELENCIA</b></h4>
                    </div>
                  </>
                  :
                  <>
                    <h1>La cita ha sido agendada</h1>
                    <h2>
                      Hola <b>{camelize(user.Name1)} {camelize(user.Name2)} {camelize(user.Surname1)} {camelize(user.Surname2)}</b>,
                      tiene una cita por concepto de{" "}
                      <b>{objAssign.DataBeanProperties.myNameChannel.toLowerCase()} </b>
                      para el{" "}
                      <b>
                        día {objAssign.DataBeanProperties.myDay.toLowerCase()}{" "}
                        {objAssign.DataBeanProperties.DayOfMonth} de{" "}
                        {objAssign.DataBeanProperties.myMonth},{" "}
                        {objAssign.DataBeanProperties.myYear} a las{" "}
                        {objAssign.DataBeanProperties.myHour}
                      </b>
                      .
                    </h2>
                    <h2>Tenga en cuenta las siguientes recomendaciones:</h2>
                    <ul>
                      <li>
                        Debe dirigirse a la oficina seleccionada para que le brinde el servicio de atención presencial.
                      </li>
                      <li>
                        Podrá acceder 5 minutos antes de lo programado a la cita.
                      </li>
                    </ul>
                    <div className="letter_pre_footer">
                      <h3>CAJA PROMOTORA DE VIVIENDA MILITAR Y POLICÍA</h3>
                      <h3>Centro de Contacto al Ciudadano: (601) 755 7070</h3>
                      <h3>
                        <strong>www.cajahonor.gov.co</strong> -{" "}
                        <strong>contactenos@cajahonor.gov.co</strong>
                      </h3>
                      <h3>Carrera 54 N°. 26-54 - Bogotá D.C. Colombia</h3>
                    </div>
                    <div className="letter_footer">
                      <h4><b>BIENESTAR Y EXCELENCIA</b></h4>
                    </div>
                  </>
                }
                <Row className="mt-3">
                  <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <Button
                      icon="pi pi-arrow-up-right"
                      label="Ver Citas Agendadas"
                      className="btn-calendar-buscar mt-2"
                      style={{ width: "100%" }}
                      onClick={() => {
                        navigate("/schedule-appointment");
                      }}
                    />
                  </Col>
                  <Col sm={12} md={6} lg={6} xl={6} xxl={6}>
                    <Button
                      icon="pi pi-arrow-up-right"
                      label="Ir a la Página Principal"
                      className="btn-calendar-buscar mt-2"
                      style={{ width: "100%" }}
                      onClick={() => {
                        navigate("/");
                      }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        );
      default:
        break;
    }
  };

  return (
    <>
      {renderSwitch()}
      {showSpinner && <Spinner show={showSpinner} />}
    </>
  );
};