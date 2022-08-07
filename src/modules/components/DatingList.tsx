import { FC, useEffect, useState } from "react";
import { Table } from "../../core/Components/Table";
import { AdminService } from "../../core/services/AdminService";
import { ToastAlert } from "../../core/Components/Toast";
import { Calendar } from "primereact/calendar";
import { formatDateTime } from "../../core/shared/FormatDate";
import { addLocale } from "primereact/api";
import { Button } from 'primereact/button';
import { Col, Row } from "react-bootstrap";


const _adminService = new AdminService();
interface Props {
  setSpinner: any
}
export const DatingList: FC<Props> = ({ setSpinner }) => {
  const [list, setList] = useState<any>([]);
  const [primerDia, setPrimerDia] = useState<any>(null);
  const [ultimoDia, setUltimoDia] = useState<any>(null);
  const [showMessage, setShowMessage] = useState(false);
  const date = new Date();
  const dia1 = new Date(date.getFullYear(), date.getMonth(), 1);
  const dia2 = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const [active, setActive] = useState(false)

  useEffect(() => {
    getListTicketPending();
  }, []);

  useEffect(() => {
    getListTicketPending();
  }, [active]);

  function buscarCitas() {
    if (primerDia && ultimoDia) {
      getListTicketPending();
      setShowMessage(false);
    } else {
      setShowMessage(true);
    }
  }

  function listarTodo() {
    setPrimerDia(null);
    setUltimoDia(null);
    setActive(!active);
  }

  const getListTicketPending = () => {
    let aux: any[] = [];
    setSpinner(true);
    _adminService
      .getListTicketPending(primerDia ? formatDateTime(primerDia) : formatDateTime(dia1), ultimoDia ? formatDateTime(ultimoDia) : formatDateTime(dia2), JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties.IDAccount)
      .subscribe((resp: any) => {
        console.log(resp)
        setSpinner(false);
        if (resp) {
          if (resp.DataBeanProperties.ObjectValue.length > 0) {
            resp.DataBeanProperties.ObjectValue.forEach((item: any) => {
              aux.push({
                IDTicket: item.DataBeanProperties.IDAppointment,
                State: item.DataBeanProperties.StateName,
                Servicio: item.DataBeanProperties.AttentionIDName,
                CanceledDescription: item.DataBeanProperties.CanceledDescription,
                CanceledDate: item.DataBeanProperties.CanceledDate,
                CanceledEntityName: item.DataBeanProperties.CanceledEntityName,
                ChannelType:
                  item.DataBeanProperties.ChannelType === 14
                    ? "Virtual"
                    : "Presencial",
                calificacion: item.DataBeanProperties.QualificationStr,
                AttentionIDName: item.DataBeanProperties.AttentionIDName,
                HoraSolicita: item.DataBeanProperties.FromDate,
                HoraInicio:
                  item.DataBeanProperties.FromDate === null
                    ? "Aun no registra"
                    : item.DataBeanProperties.FromDate,
                HoraFin:
                  item.DataBeanProperties.UptoDate === null
                    ? "Aun no registra"
                    : item.DataBeanProperties.UptoDate,
              });

              const newAux = aux.sort(() => {
                return -1
              })
              setList(newAux);
            });
          } else {
            setSpinner(false);
            setList([]);
          }
        } else {
          setSpinner(false);
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

  return (
    <>
      <div className="container" style={{ marginTop: 50 }}>
        <Row>
          <Col sm={12} lg={12} xl={1} xxl={1} style={{ marginTop: "10px" }} className="caja-boton-calendar">
            <label style={{ color: "white", userSelect: "none" }}>0</label>
            <Button icon=" pi pi-align-justify" style={{ padding: "10px 10px", width: "100%", marginTop: "2px", display: "flex" }} className="btn-calendar-buscar" onClick={() => { listarTodo() }} iconPos="right" tooltip="Listar todo" />
          </Col>
          <Col sm={12} lg={12} xl={3} xxl={4} style={{ marginTop: "10px" }}>
            <label>Fecha Inicio</label>
            <Calendar locale={"es"} value={primerDia} onChange={(e) => { setPrimerDia(e.value) }} showIcon dateFormat="dd/mm/yy" placeholder="Fecha inicio" style={{ width: "100%" }} />
            {showMessage && !primerDia && <span className="message-input" style={{ display: "block" }}>Campo requerido</span>}
          </Col>
          <Col sm={12} lg={12} xl={3} xxl={4} style={{ marginTop: "10px" }}>
            <label>Fecha Final</label>
            <Calendar locale={"es"} value={ultimoDia} onChange={(e) => { setUltimoDia(e.value) }} showIcon dateFormat="dd/mm/yy" placeholder="Fecha final" style={{ width: "100%" }} />
            {showMessage && !ultimoDia && <span className="message-input" style={{ display: "block" }}>Campo requerido</span>}
          </Col>
          <Col sm={12} lg={12} xl={5} xxl={3} style={{ marginTop: "10px" }} className="caja-boton-calendar">
            <label style={{ color: "white", userSelect: "none" }}>0</label>
            <Button label="Buscar citas" style={{ padding: "10px 30px", width: "100%", marginTop: "2px" }} className="btn-calendar-buscar" onClick={buscarCitas} icon="pi pi-search" iconPos="right" />
          </Col>
        </Row>
        {list.length > 0 ?
          <Table list={list} />
          :
          <section style={{ padding: "50px", textAlign: "center" }}>
            <h1 className="texto-datingList">No hay citas registradas en esa fecha</h1>
          </section>
        }
      </div>
    </>
  );
};
