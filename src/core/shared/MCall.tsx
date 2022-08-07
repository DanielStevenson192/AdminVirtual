import { Dialog } from "primereact/dialog";
import { FC, useEffect, useState } from "react";
import { GlobalService } from "../services/GlobalService";
import "../../modules/styles/Mcall.css";
import { Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
interface Props {
  show: boolean;
  setShow: any;
  name: string;
  ws: string;
  room: string;
  tipo: "cliente";
  turno: any;
  idTicket: any;
}
const _globalService = new GlobalService();
export const MCall: FC<Props> = ({
  show,
  setShow,
  name,
  ws,
  room,
  tipo,
  turno,
  idTicket,
}) => {
  const [showDialog, setShowDialog] = useState<boolean>(show);
  const [cronometro, setCronometro] = useState<any>();
  const [showPoll, setShowPoll] = useState<boolean>(false);
  const [objectMeet, setObjectMeet] = useState<any>({});
  const wsEncode = encodeURIComponent(ws);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(0);
  const [stop, setStop] = useState<any>(false);
  const [callStop, setCallStop] = useState<string>("false");
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();
  // let history=useHistory();
  const params = useParams();

  useEffect(() => {
    localStorage.setItem("callStop", "false");
    localStorage.setItem("stop", "false");
    getUrl();
  }, []);

  useEffect(() => {
    let interval: any = null;
    handleStart();
    if (isActive && isPaused === false) {
      interval = setInterval(() => {
        setTime((time) => time + 1000);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused]);

  useEffect(() => {
    //localStorage.setItem("stop",'false');
    setCronometro(
      (new Date(time).getMinutes() < 10 ? "0" : "") +
        new Date(time).getMinutes().toLocaleString() +
        ":" +
        (new Date(time).getSeconds() < 10 ? "0" : "") +
        new Date(time).getSeconds().toLocaleString()
    );

    setStop(localStorage.getItem("stop") || "false");
    setCallStop(localStorage.getItem("callStop") || "false");

    if (stop === "true") {
      setTime(0);
    }
    if (callStop === "true") {
      setConfirm(true);
      setShowPoll(true);
    }
  }, [time]);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setIsActive(false);
    setTime(0);
  };

  const getUrl = () => {
    _globalService.getSystemPropertyList().subscribe((resp: any) => {
      if (resp.filter((item: any) => item.AppName === "meet").length > 0) {
        setObjectMeet(resp.filter((item: any) => item.AppName === "meet")[0]);
      } else {
        alert("No se encontro variable de entorno de la llamada");
      }
    });
  };

  const handleShowPoll = () => {
    handlePauseResume();
    setShowPoll(true);
  };
  const getCloseAttention = (value: string | null) => {
    _globalService
      .getCloseAttention(idTicket, null, value)
      .subscribe((resp) => {
        if (resp) {
          handleShowPoll();
          setShowDialog(false);
          setShow(false);
          localStorage.setItem("stop", "false");
          localStorage.setItem("callStop", "false");
          navigate("/");
        }
      });
  };

  return (
    <>
      <div
        className=" d-flex justify-content-between mt-5"
        style={{ marginBottom: 10 }}
      >
        <h2>{stop === "false" ? `Tiempo de espera - ${cronometro}` : ""}</h2>
        <h2>{turno && `Turno: ${turno}`}</h2>
      </div>
      <Row>
        {objectMeet.SystemValue && (
          <iframe
            title="videollamada"
            src={`${objectMeet.SystemValue}/?tipo=${tipo}&nombre=${name}&room=${room}&ws=${wsEncode}&console=false`}
            style={{ height: "70vh" }}
            className="col-12"
          ></iframe>
        )}
      </Row>

      {/* <Row>
        <div className="col-12 mt-3" style={{ backgroundColor: "grey",height:'25vh' }}>
          <h6>Información Asesor</h6>
        </div>
      </Row> */}
      <>
        {showPoll && (
          <Dialog
            visible={showPoll}
            header="Calificación"
            modal
            style={{ maxWidth: 450 }}
            onHide={() => {
              localStorage.setItem("stop", "false");
              localStorage.setItem("callStop", "false");
              getCloseAttention(null);
              navigate("/dashboard");
              handleShowPoll();
            }}
          >
            <div>
              <p style={{ fontSize: 20 }}>Califica el servicio del asesor.</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "end",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column-reverse",
                  }}
                >
                  <div className="button__grid">
                    <button
                      className="btn-redondo"
                      onClick={() => {
                        getCloseAttention("MALO");
                      }}
                    ></button>
                    <p>MALO</p>
                  </div>
                  <div className="button__grid">
                    <button
                      className="btn-redondo"
                      onClick={() => {
                        getCloseAttention("REGULAR");
                      }}
                    ></button>
                    <p>REGULAR</p>
                  </div>

                  <div className="button__grid">
                    <button
                      className="btn-redondo"
                      onClick={() => {
                        getCloseAttention("BUENO");
                      }}
                    ></button>
                    <p>BUENO</p>
                  </div>
                  <div className="button__grid">
                    <button
                      className="btn-redondo"
                      onClick={() => {
                        getCloseAttention("EXCELENTE");
                      }}
                    ></button>
                    <p>EXCELENTE</p>
                  </div>
                </div>
              </div>
            </div>
          </Dialog>
         )} 
      </>
    </>
  );
};
