import { Button } from "primereact/button";
import { Card } from "primereact/card";
import React, { FC, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import "../styles/MyProcedure.css"
import imageWatermark from "../../assets/img/home-01.png";
import { TrayService } from "../../core/services/TrayService";
import { ToastAlert } from "../../core/Components/Toast";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import logo from "../../assets/img/home-01.png";
import { useLocation, useNavigate } from "react-router-dom";
import { SLoadDocument } from "../../core/shared/SLoadDocument";
import { BpmService } from "../../core/services/BpmService";

const _trayService = new TrayService();
const _bpmService = new BpmService();

interface Props {
    setSpinner: any;
}

export const MyProcedure: FC<Props> = ({
    setSpinner
}) => {

    const [step, setStep] = useState<number>(0);
    const { Toasty } = ToastAlert();
    const [user, setUser] = useState<any>({});
    const [listProcedure, setListProcedure] = useState<any>([]);
    const [nameProcedure, setNameProcedure] = useState<any>({});
    const [requirementsList, setRequirementsList] = useState<any>([]);
    const navigate = useNavigate();
    const [showUpload, setShowUpload] = useState(false);
    const [formData, setFormData] = useState<any>({});
    const [idProcedureImp, setIdProcedureImp] = useState<number>(0);
    const rutaActual = useLocation();
    const gestionarRutas = () => {
        if (rutaActual.pathname === "/my-procedure") {
            navigate("/procedure");
        }
    }

    useEffect(() => {
        setUser(
            JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
        );
        console.log(user.IDAccount);
        getProcedureImpForInput(JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties.IDAccount);
    }, []);

    const getProcedureImpForInput = (idAccount: number) => {
        setSpinner(true);
        _trayService
            .getProcedureImpForInput(idAccount)
            .subscribe((resp: any) => {
                console.log(resp);
                setSpinner(false);
                if (resp) {
                    setListProcedure(resp);
                } else {
                    Toasty({
                        type: "error",
                        message: `No se puede iniciar `,
                    });
                }
            });
    };

    const getProcedureActionByAccount = (
        idAccount: number,
        idProcedureImp: number
    ) => {
        setSpinner(true);
        _trayService
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
                        setRequirementsList(resp);
                    } else {
                        setRequirementsList(resp);
                        setStep(2);
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

    const handleStep = (data: any) => {
        console.log(data);
        setIdProcedureImp(data.IDProcedureImp);
        setNameProcedure(data.Name);
        setStep(1);
        getProcedureActionByAccount(user.IDAccount, data.IDProcedureImp);
    }

    /**
   * TODO: AGREGAR BOTONES PARA CARGUE DE DOCUMENTO
   * @param data *
   * @returns
   */
    const BotonActions = (data: any) => {
        return (
            <Button
                icon="pi pi-cloud-upload"
                tooltip="Adjuntar Archivo"
                onClick={() => {
                    setShowUpload(true);
                    setFormData(data);
                }}
            />
        );
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

    const switchRender = () => {
        switch (step) {
            case 0:
                return (
                    <div className="container-ticket p-4">
                        <Button className="btn-atras btn-atras-2 px-4" icon="pi pi-arrow-left" label="Atras" onClick={gestionarRutas} />
                        <h1 className="text-center mt-5 mb-5"><strong>Trámites en Proceso</strong></h1>
                        {listProcedure.length > 0 ? (
                            <section style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
                                {listProcedure.map((item: any) => {
                                    return (
                                        <div style={{ margin: "10px" }} className="card-tramite">
                                            <h1><strong>{item.Name}</strong></h1>
                                            <Row>
                                                <Col xxl={3}>
                                                    <h5><strong>Inicio: </strong>{item.Since}</h5>
                                                </Col>
                                                <Col xxl={9}>
                                                    <h5><strong>Etapa: </strong>{item.ProcedureName}</h5>
                                                </Col>
                                            </Row>
                                            <Button
                                                icon="pi pi-eye"
                                                className="p-button-rounded p-button-secondary icono-tramite"
                                                aria-label="Bookmark"
                                                onClick={() => { handleStep(item) }}
                                            />
                                        </div>
                                    )
                                })}
                            </section>
                        ) : (
                            <div className="p-5">
                                <h1>No hay trámites</h1>
                            </div>
                        )}
                    </div>
                );
            case 1:
                return (
                    <>
                        <p className="mt-5" style={{ fontSize: 20 }}>
                            Por favor cargue los documentos solicitados para{" "}
                            <strong style={{ fontSize: 20 }}>{nameProcedure}</strong>
                            . La documentación solicitada será revisada por un
                            funcionario, una vez ésta sea aprobada podrá agendar su cita
                            virtual. <br />
                        </p>
                        <h3 className="text-right">
                            <strong>
                                {requirementsList.length} documento(s) por subir.
                            </strong>
                        </h3>
                        <DataTable
                            className="table-turn"
                            value={requirementsList}
                            paginator
                            responsiveLayout="scroll"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} hasta {last} de {totalRecords} citas registradas."
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}
                        >
                            <Column field="Name" header="Documento"></Column>
                            <Column field="UptoDate" header="Fecha"></Column>
                            <Column
                                field="DocumentTypeName"
                                header="Tipo de Documento"
                            ></Column>
                            <Column body={BotonActions} header="Acciones"></Column>
                        </DataTable>
                    </>
                );
            case 2:
                return (
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
                );
        }
    };

    return (
        <>
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