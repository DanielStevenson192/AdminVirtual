import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { FC, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Col, Row } from "react-bootstrap";


interface Props {
  list: any;
}

interface typeInfoDate {
  fecha: string,
  descripcion: string,
  nombre: string

}

export const Table: FC<Props> = (props: Props) => {

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [infoDate, setinfoDate] = useState<typeInfoDate>({ fecha: "", descripcion: "", nombre: "" });



  const mostrarModal = (item: any) => {
    const { CanceledDate, CanceledDescription, CanceledEntityName } = item;
    setinfoDate({ nombre: CanceledEntityName, fecha: CanceledDate, descripcion: CanceledDescription });
    setShowInfo(true);
  }


  const BotonActions = (data: any) => {
    return (

      data.State === "CANCELADO" &&
      <Button
        icon="pi pi-info-circle"
        disabled={data.State === "CANCELADO" ? false : true}
        onClick={() => { mostrarModal(data) }}
      />)
  }

  const columFecha = (item: any) => {

    const fecha = new Date(item.HoraInicio);
    const newDate = fecha.getDate() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getFullYear()
    return (
      <>{newDate}</>
    )

  }


  /*   const columHora = (item: any) => {
  
      console.log("HORAA", item)
  
      const hora = new Date(item.HoraInicio);
      console.log("Minutos", hora.getMinutes())
      const newDate = hora.getHours()
      return (
        <>{hora.getHours() + ":" + Number(hora.getMinutes()) === 0 ? 0 : 0}</>
      )
  
    } */


  return (
    <div>
      <Card style={{ textAlign: "center", marginTop: 20 }}>
        <div className="schedule__title">
          <h1 className="text-center mb-5">HISTORIAL DE CITAS</h1>
        </div>
        <DataTable
          className="table-turn"
          value={props.list}
          paginator
          responsiveLayout="scroll"
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Mostrando {first} hasta {last} de {totalRecords} citas registradas."
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
        >
          <Column
            body={columFecha}
            header="Fecha inicio"
          ></Column>

          {/*     <Column
            body={columHora}
            header="Hora inicio"
          ></Column>
 */}

          <Column
            field="ChannelType"
            header="Tipo de atención"

          ></Column>
          <Column
            field="State"
            header="Estado"
          ></Column>
          <Column
            field="AttentionIDName"
            header="Servicio"
          ></Column>
          <Column
            body={BotonActions}
          ></Column>
        </DataTable>
      </Card>

      <div className="card">

        <Dialog
          header="Información de cancelación de cita"
          visible={showInfo}

          onHide={() => {
            setShowInfo(false);
          }}
        >
          <div>
            <Row>
              <Col sm={12}>
                <Card className="mt-4">
                  <h4><strong>Fecha de cancelación</strong> </h4>
                  <p style={{ fontSize: 20 }}>{infoDate.fecha}</p>
                </Card>
              </Col>
              <Col sm={12}>
                <Card className="mt-4">
                  <h4><strong>¿Quíen cancelo?</strong></h4>
                  <p style={{ fontSize: 20 }}>{infoDate.nombre}</p>
                </Card>
              </Col>
              <Col sm={12}>
                <Card className="mt-4">
                  <h4><strong>Descripción</strong></h4>
                  <p style={{ fontSize: 18 }}>{infoDate.descripcion ? infoDate.descripcion : "No hay motivo."}</p>
                </Card>
              </Col>
            </Row>
          </div>
        </Dialog>
      </div>
    </div>

  );


};
