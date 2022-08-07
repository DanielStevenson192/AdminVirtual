import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { Button } from "primereact/button";
import { useState, useEffect, FC } from "react";
import { BpmService } from "../../core/services/BpmService";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SLoadDocument } from "../../core/shared/SLoadDocument";
import { ToastAlert } from "../../core/Components/Toast";
import { ConfirmDialog } from "primereact/confirmdialog";
import { confirmDialog } from "primereact/confirmdialog";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/img/home-01.png";

import "../styles/procedure.css";

const _bpmService = new BpmService();

interface Props {
  setSpinner: any;
}

interface IList {
  label: string;
  value: number;
}

export const RequestProcedure: FC<Props> = ({ setSpinner }) => {
  const [step, setStep] = useState<number>(0);
  const [procedure, setProcedure] = useState<number>();
  const [listProcedures, setListProcedure] = useState<IList[]>([]);
  const [requirementsList, setRequirementsList] = useState<any>([]);
  const [user, setUser] = useState<any>({});
  const [showUpload, setShowUpload] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [idProcedureImp, setIdProcedureImp] = useState<number>(0);
  const [uncomplete, setUncomplete] = useState<boolean>(true);
  const [alphaCode, setAlphaCode] = useState<any>(null);
  const { Toasty } = ToastAlert();
  const navigate = useNavigate();
  useEffect(() => {
    setUser(
      JSON.parse(localStorage.getItem("usuario") ?? "").DataBeanProperties
    );
    getBusinessProcessCatalog();
  }, []);
  useEffect(() => {
    if (requirementsList.length === 0) {
      setUncomplete(false);
    } else {
      setUncomplete(true);
    }
    console.log("lista de requerimientos", requirementsList);
  }, [requirementsList]);

  const getBusinessProcessCatalog = () => {
    _bpmService.getBusinessProcessCatalog().subscribe((resp: any) => {
      console.log("info servicios", resp);
      if (resp.length > 0) {
        setListProcedure(
          resp.map((item: any) => {
            return { label: item.Name, value: item.IDBusinessProcess };
          })
        );
      } else {
        alert("no hay servicios disponibles par ala carecterizacion");
        return;
      }
    });
  };
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

  const createProcess = (
    idProcedure: any,
    idAccount: number,
    idCharacterization: number
  ) => {
    setSpinner(true);
    _bpmService
      .createBusinessProcessAndNextStage(
        idProcedure,
        idAccount,
        idCharacterization
      )
      .subscribe((resp: any) => {
        console.log(resp);
        setSpinner(false);
        if (resp.DataBeanProperties.ObjectValue) {
          setStep(1);
          setIdProcedureImp(
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .IDProcedureImp
          );
          getProcedureActionByAccount(
            idAccount,
            resp.DataBeanProperties.ObjectValue.DataBeanProperties
              .IDProcedureImp
          );
        } else {
          Toasty({
            type: "error",
            message: `No se puede iniciar el trámite ${resp.DataBeanProperties.ErrorMessage}`,
          });
        }
      });
  };

  const getProcedureActionByAccount = (
    idAccount: number,
    idProcedureImp: number
  ) => {
    setSpinner(true);
    _bpmService
      .getProcedureActionByAccount(idAccount, idProcedureImp)
      .subscribe((resp: any) => {
        console.log("reosuesta informacion de trmite", resp);
        setSpinner(false);
        if (resp) {
          if (resp.length > 0) {
            Toasty({
              type: "warning",
              message: `Faltan por cargar ${resp.length} documentos`,
            });
            setAlphaCode(resp[0].AlphaCode);
            setRequirementsList(resp);
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

  const handleSubmit = () => {
    console.log("Enviar");
    console.log("Procedure", procedure);
    console.log("Account", user.IDAccount);
    console.log("Caracterización", user.IDCharacterization);
    createProcess(procedure, user.IDAccount, user.IDCharacterization);
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
  const acceptFunc = () => {
    handleSubmit();
  };
  const rejectFunc = () => {};
  const getProcedureName = () => {
    return listProcedures.filter((item: IList) => item.value === procedure)[0]
      .label;
  };

  const confirm = () => {
    confirmDialog({
      message: <>¿Esta seguro de iniciar trámite <strong style={{fontSize:18}}>{getProcedureName()}</strong>?</>,
      header: "Confirmación",
      acceptLabel: "Si",
      acceptIcon: "pi pi-check",
      acceptClassName: "btn-accept",
      rejectLabel: "No",
      rejectIcon: "pi pi-times",
      rejectClassName: "btn-reject",
      accept: () => acceptFunc(),
      reject: () => rejectFunc(),
    });
  };

  const switchRender = () => {
    switch (step) {
      case 0:
        return (
          <div className="container-ticket">
            <div
              className="form-calendar"
              style={{ margin: "50px auto", width: "60%" }}
            >
              <h1 className="text-center ">
              Bienvenido a la sección de trámite digital
              </h1>
              <p className="mt-3" style={{ textAlign: "justify" }}>
                Seleccione el
                servicio que desea tomar y al iniciar el trámite debe adjuntar
                la documentación requerida en formato PDF, la cual será revisada
                y una vez aprobada se habilitara el agendamiento para continuar
                con el proceso.
              </p>
              <div className="caja-input mt-5">
                <label>Elija el trámite que desea</label>
                <div className="caja-input">
                  <Dropdown
                    className="select_ticket"
                    value={procedure}
                    options={listProcedures}
                    onChange={(e: any) => {
                      setProcedure(e.value);
                    }}
                    placeholder="Seleccione un trámite"
                  />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  className="mt-5 btn_request"
                  label="Iniciar trámite"
                  icon="pi pi-users"
                  iconPos="right"
                  style={{ width: "100%" }}
                  onClick={() => confirm()}
                ></Button>
              </div>
              <ConfirmDialog />
            </div>
          </div>
        );
      case 1:
        return (
          <>
            {uncomplete && (
              <>
                <p className="mt-5" style={{ fontSize: 20 }}>
                  Por favor cargue los documentos solicitados para{" "}
                  <strong style={{ fontSize: 20 }}>{getProcedureName()}</strong>
                  .<br/>La documentación solicitada será revisada por un
                  funcionario, una vez ésta sea aprobada podrá agendar su cita
                  virtual para continuar con el proceso.
                  <br />
                </p>
                <h3 className="text-right">
                  <strong>
                    {requirementsList.length} documento(s) por subir.
                  </strong>
                </h3>
                <DataTable
                  className="table-turn table-row"
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

                <div className="table-card">
                  {requirementsList.map((item: any) => {
                    return (
                      <div className="card-row">
                        <h4>
                          <strong>Documento</strong>
                        </h4>
                        <span>{item.Name}</span>
                        <h4>
                          <strong>Fecha</strong>
                        </h4>
                        <span>{item.UptoDate}</span>
                        <h4>
                          <strong>Tipo de Documento</strong>
                        </h4>
                        <span>{item.DocumentTypeName}</span>
                        <div className="mt-3">
                          <Button
                            icon="pi pi-cloud-upload"
                            tooltip="Adjuntar Archivo"
                            onClick={() => {
                              setShowUpload(true);
                              setFormData(item);
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
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
                    <strong>
                      Radicado N<span style={{ fontSize: 20 }}>o</span>:{" "}
                      <span>{alphaCode}</span>
                    </strong>
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
    }
  };
  return (
    <>
      <div>{switchRender()}</div>
      {/* {showSpinner && <Spinner show={showSpinner} />} */}
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
