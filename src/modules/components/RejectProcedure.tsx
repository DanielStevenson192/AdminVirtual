import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Button } from "primereact/button";
import { BpmService } from "../../core/services/BpmService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SLoadDocument } from "../../core/shared/SLoadDocument";
import { ToastAlert } from "../../core/Components/Toast";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/rejected.css";

import logo from "../../assets/img/home-01.png";

const { Toasty } = ToastAlert();
interface IRejectProcedure {
  setSpinner: any;
}

const _bpmService = new BpmService();

export const RejectProcedure: React.FC<IRejectProcedure> = ({ setSpinner }) => {
  const [step, setStep] = useState<number>(0);
  const [procedureList, setprocedureList] = useState<any[]>([]);
  const [user, setUser] = useState<any>();
  const [requirementsList, setRequirementsList] = useState<any>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [idProcedureImp, setIdProcedureImp] = useState<number>(0);
  const [uncomplete, setUncomplete] = useState<boolean>(true);
  const navigate = useNavigate();
  const rutaActual = useLocation();
  const gestionarRutas = () => {
    if (rutaActual.pathname === "/reject-procedure") {
      navigate("/procedure");
    }
  }

  useEffect(() => {
    setUser(
      JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
    );
  }, []);
  useEffect(() => {
    if (user) {
      getProcedureImpRejectedForInput(user.IDAccount);
    }
  }, [user]);

  useEffect(() => {
    if (requirementsList.length === 0) {
      setUncomplete(false);
    } else {
      setUncomplete(true);
    }
  }, [requirementsList]);

  const getProcedureImpRejectedForInput = (idAccount: number) => {
    setSpinner(true);
    _bpmService
      .getProcedureImpRejectedForInput(idAccount)
      .subscribe((resp: any) => {
        setSpinner(false);
        if (!resp) {
          Toasty({
            type: "error",
            message: `No se recibio respuesta del servidor`,
          });
        }
        if (resp.length > 0) {
          console.log(resp);
          setprocedureList(resp);
        } else {
          Toasty({
            type: "warning",
            message: `No hay datos para mostrar`,
          });
        }
      });
  };
  const getProcedureActionRejected = (
    idAccount: number,
    idProcedure: number
  ) => {
    setSpinner(true);
    _bpmService
      .getProcedureActionRejected(idAccount, idProcedure)
      .subscribe((resp: any) => {
        setSpinner(false);
        if (!resp) {
          Toasty({
            type: "error",
            message: `no hubo respuesta del servidor`,
          });
          return;
        }
        if (resp.length > 0) {
          setRequirementsList(resp);
        } else {
          setStep(2);
        }
      });
  };
  const BotonActions = (data: any) => {
    return (
      <Button
        icon="pi pi-cloud-upload"
        tooltip="Adjuntar Archivo"
        style={{width:'100%'}}
        onClick={() => {
          setShowUpload(true);
          setFormData(data);
        }}
      />
    );
  };
  const getProcedureActionByAccount = (
    idAccount: number,
    idProcedureImp: number
  ) => {
    setSpinner(true);
    _bpmService
      .getProcedureActionByAccount(idAccount, idProcedureImp)
      .subscribe((resp: any) => {
        console.log(resp);
        setSpinner(false);
        if (resp) {
          if (resp.length > 0) {
            Toasty({
              type: "warning",
              message: `Faltan por cargar ${resp.length} documentos`,
            });

            setRequirementsList(resp.map((item:any)=>{
              return {...item,Observations:(<p style={{fontSize:'20px !important'}}>{item.Observations}</p>)}
            }));

            console.log('lista de requerimientos',requirementsList)
          } else {
            setRequirementsList(resp);
            Toasty({
              type: "success",
              message: `Archivos cargados correctamente`,
            });
          }
        } else {
          Toasty({
            type: "error",
            message: `No se puede iniciar `,
          });
        }
      });
  };
  const responseProcedureAction = (idAction: number, response: any) => {
    setSpinner(true);
    _bpmService
      .responseProcedureAction(idAction, response)
      .subscribe((resp: any) => {
        console.log(resp);
        setSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          getProcedureActionByAccount(user.IDAccount, idProcedureImp);
        } else {
          Toasty({
            type: "error",
            message: `No se puede iniciar `,
          });
        }
      });
  };
  const handleFile = (data: any) => {
    console.log(data);
    console.log(formData);
    if (data) {
      const response = {
        Media: data.Media,
        MediaContext: data.MediaContext,
      };
      console.log(formData.IDAction, response);
      responseProcedureAction(formData.IDAction, response);
    }
  };

  console.log("listado de tramites devueltos", requirementsList);
  const switchRender = () => {
    switch (step) {
      case 0:
        return (
          <>
            {procedureList.length > 0 ? (
              <div className="container-ticket p-4">
                <h1 className="text-center mt-5 mb-5">
                  <strong>Trámites Devueltos</strong>
                </h1>

                <section
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {procedureList.map((item: any) => {
                    return (
                      <div style={{ margin: "10px" }} className="card-tramite">
                        <h1>
                          <strong>{item.BusinessProcessName}</strong>
                        </h1>
                        <Row>
                          <Col xxl={12}>
                            <h5>
                              <strong>Fecha de radicación:</strong> {item.Since}
                            </h5>
                          </Col>
                          <Col xxl={12}>
                            <h5>
                              <strong>Radicado No:</strong> {item.AlphaCode}
                            </h5>
                          </Col>

                          <Col xxl={9}>
                            <h5>
                              <strong>Etapa:</strong> {item.ProcedureName}
                            </h5>
                          </Col>
                          
                        </Row>

                        <Button
                          icon="pi pi-eye"
                          className="p-button-rounded p-button-secondary icono-tramite"
                          aria-label="Bookmark"
                          tooltip="ver Documentos devueltos"
                          onClick={() => {
                            getProcedureActionRejected(
                              user.IDAccount,
                              item.IDProcedureImp
                            );
                            setIdProcedureImp(item.IDProcedureImp);
                            setStep(1);
                          }}
                        />
                      </div>
                    );
                  })}
                </section>
              </div>
            ) : (
              <>
                <div
                  className="water-mark mt-5"
                  style={{
                    height: 400,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="logo-container">
                    <img className="logo" src={logo} alt="" />
                  </div>
                  {/* <svg
                    className="checkmark"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                  >
                    <circle
                      className="checkmark__circle"
                      cx="26"
                      cy="26"
                      r="25"
                      fill="none"
                    />
                    <path
                      className="checkmark__check"
                      fill="none"
                      d="M14.1 27.2l7.1 7.2 16.7-16.8"
                    />
                  </svg> */}
                  <h1 className="mt-5">
                    <strong>No tiene documentos devueltos</strong>
                  </h1>
                  <h2 className="w-75 text-center m-auto">
                    <br />
                    Para regresar a la página principal haga clic
                    <b
                      onClick={() => {
                        navigate("/", { replace: true });
                      }}
                    >
                      <u className="pointer"> AQUÍ </u>
                    </b>
                  </h2>
                </div>
              </>
            )}
          </>
        );
      case 1:
        return (
          <>
            <div className="mt-3">
            <Button
              className="mt-5 btn_request"
              label="Atrás"
              icon="pi pi-angle-left"
              iconPos="left"
              style={{ width: "150px" }}
              onClick={() => setStep(0)}
            ></Button>
            </div>
            {uncomplete && (
              <DataTable
                className="table-turn table__reject"
                value={requirementsList}
                paginator
                responsiveLayout="stack"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} hasta {last} de {totalRecords} citas registradas."
                rows={10}
                rowsPerPageOptions={[10, 20, 50]}
              >
                <Column field="Name" header="Documento" className="table-resp"></Column>
                <Column field="UptoDate" header="Fecha" className="table-resp"></Column>
                <Column field="Observations" header="Observaciones" className="table-resp" ></Column>
                <Column
                  field="DocumentTypeName"
                  header="Tipo de Documento"
                  className="table-resp"
                ></Column>
                <Column body={BotonActions} header="Acciones" className="table-resp tb-btn-resp"></Column>
              </DataTable>
            )}

            {!uncomplete && (
              <>
              <div className="water-mark mt-5">
                <div className="logo-container">
                  <img className="logo" src={logo} alt="" />
                </div>
                <svg
                  className="checkmark"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="checkmark__circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="checkmark__check"
                    fill="none"
                    d="M14.1 27.2l7.1 7.2 16.7-16.8"
                  />
                </svg>
                <h2 className="w-75 text-center m-auto">
                  Muchas Gracias!, Documentos cargados correctamente, un
                  funcionario los revisara.Cuando los documentos sean
                  aprobados podra agendar una cita.
                  <br />
                  <br />
                  <div>
                    <p
                      onClick={() => {
                        navigate("/", { replace: true });
                      }}
                    >    
                      Para regresar a la página principal haga clic {" "}
                      <span className="pointer" style={{fontWeight:'bolder',fontSize:24}}>
                        <u>Aquí</u>
                      </span>
                    </p>
                    <p
                      onClick={() => {
                        navigate("/assign-appointment", { replace: true });
                      }}
                    > 
                     Para Agendar una cita haga clic {" "}
                      <span className="pointer" style={{fontWeight:'bolder',fontSize:24}}>
                       
                        <u>Aquí</u>
                      </span>
                    </p>
                    <p
                      onClick={() => {
                        navigate("/assign-appointment", { replace: true });
                      }}
                    > 
                     Para solicitar una atención en linea haga clic {" "}
                      <span className="pointer" style={{fontWeight:'bolder',fontSize:24}}>
                        <u>Aquí</u>
                      </span>
                    </p>
                  </div>
                </h2>
              </div>
            </>
            )}
          </>
        );
      case 2:
        return <></>;
    }
  };

  return (
    <>
      <Button className="btn-atras btn-atras-2 px-4" icon="pi pi-arrow-left" label="Atras" onClick={gestionarRutas} />
      <div>{switchRender()}</div>
      {showUpload && (
        <SLoadDocument
          show={showUpload}
          objData={formData}
          setShow={setShowUpload}
          setFile={handleFile}
        />
      )}
    </>
  );
};
