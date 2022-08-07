import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import imageIcon from "../../assets/img/logo_sin_fondo.png";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Formik } from "formik";
import { AdminService } from "../services/AdminService";
import { ToastAlert } from "../Components/Toast";
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from "../shared/Spinner";
import { useEffect } from "react";
import { Checkbox } from "primereact/checkbox";
interface ILogin {
  setIsLogged: any;
}

type IValues = {
  identification: string;
  code_otp: string;
};

const _AdminService = new AdminService();

export const Login: React.FC<ILogin> = (props: ILogin) => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [heightDescription, setHeightDescription] = useState("50px");
  const [sizeTitle, setSizeTitle] = useState();
  const [showDescription, setShowDescription] = useState(false);
  const [showText, setShowText] = useState(true);
  const [showOPN, setShowOPN] = useState(true);
  const [cronometro, setCronometro] = useState<any>();
  const [time, setTime] = useState(300000);
  const [isActive, setIsActive] = useState(true);
  const isPaused = false;
  const [active, setActive] = useState(false);
  const [polCheck, setPolCheck] = useState(false);
  const [otpTransaction, setotpTransation] = useState<string>("");
  const { Toasty } = ToastAlert();
  const navigate = useNavigate();
  const [NIT, setNIT] = useState(0);
  const [disableInput, setDisableInput] = useState(false);
  const [showPolitic, setShowPolitic] = useState(true);

  useEffect(() => {
    fetch(
      "https://geolocation-db.com/json/8dd79c70-0801-11ec-a29f-e381a788c2c0"
    )
      .then((response) => response.json())
      .then((res) => {
        console.log("API ", res);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  window.onresize = () => {
    if (window.innerWidth < 500) {
      setHeightDescription("50px");
      setShowDescription(true);
    } else {
      setHeightDescription("100%");
      setShowDescription(false);
    }
  };

  function MostrarDescripcion() {
    setHeightDescription("100%");
  }
  useEffect(() => {
    if (active) {
      let interval: any = null;

      if (isActive) {
        if (isActive && isPaused === false) {
          interval = setInterval(() => {
            setTime((time) => time - 1000);
          }, 1000);
        } else {
          clearInterval(interval);
        }
        return () => {
          clearInterval(interval);
        };
      }
    }
  }, [isActive, isPaused, active]);

  const handleStop = () => {
    setIsActive(false);
  };

  useEffect(() => {
    if (cronometro === "00:00") {
      handleStop();
    }
  }, [cronometro]);

  useEffect(() => {
    setCronometro(
      (new Date(time).getMinutes() < 10 ? "0" : "") +
      new Date(time).getMinutes().toLocaleString() +
      ":" +
      (new Date(time).getSeconds() < 10 ? "0" : "") +
      new Date(time).getSeconds().toLocaleString()
    );
  }, [time]);

  useEffect(() => {
    if (window.innerHeight <= 750) {
      setShowText(false);
    }

    if (window.innerWidth < 500) {
      setHeightDescription("50px");
      setShowDescription(true);
    } else {
      setHeightDescription("100%");
      setShowDescription(false);
    }
  }, []);

  /* 
    //VALIDA LA CEDULA
    const validateNit = (values: IValues) => {
      if (values.identification) {
        setShowSpinner(true);
        _AdminService
          .validateAccountFromNit(Number(values.identification))
          .subscribe((res: any) => {
            if (res.DataBeanProperties.ObjectValue) {
              setotpTransation(res.DataBeanProperties.ObjectValue.DataBeanProperties.OtpTransactionId);
              sendOTP(Number(values.identification));
            } else {
              setShowSpinner(false);
              setShowSpinner(false);
              Toasty({
                type: "error",
                message: "La identificación es incorrecta",
              });
            }
          });
      }
    };
   */

  //ENVIAR CODIGO OTP
  const sendOTP = (nit: number) => {
    setShowSpinner(true);
    _AdminService.createOTPCode(nit).subscribe((res: any) => {
      console.log("RESPONSE DEL ENVIO OTP", res);
      setShowSpinner(false);
      if (res.DataBeanProperties.ObjectValue) {
        if (res.DataBeanProperties.ObjectValue.DataBeanProperties.SmsSendingStatus == "ok") {
          setNIT(nit);
          setShowOPN(false);
          setActive(true);
          setDisableInput(true);
          setotpTransation(res.DataBeanProperties.ObjectValue.DataBeanProperties.OtpTransactionId);
        } else {
          setShowSpinner(false);
          Toasty({
            type: "error",
            message: `${res.DataBeanProperties.ObjectValue.DataBeanProperties.ErrorMessage}`,
          });
        }
      } else {
        setShowSpinner(false);
        Toasty({
          type: "error",
          message: `${res.DataBeanProperties.ErrorMessage}`,
        });
      };
    });
  }


  //VALIDA EL CODIGO OTP
  const validateOTP = (values: any) => {
    setShowSpinner(true);
    const { code_otp, identification } = values;
    _AdminService.validateOTP(identification, code_otp, otpTransaction).subscribe((res: any) => {
      console.log(res);
      if (res.DataBeanProperties.ObjectValue) {
        if (res.DataBeanProperties.ObjectValue.DataBeanProperties.EsValidaOTP) {
          localStorage.setItem("usuario", JSON.stringify(res.DataBeanProperties.ObjectValue.DataBeanProperties.WorkSession.DataBeanProperties.Account));
          localStorage.setItem("token", JSON.stringify(true));
          Toasty({ type: "success", message: "Logeado con exito" });
          props.setIsLogged(true);
          setShowSpinner(false);
          navigate('/dashboard');
        } else {
          setShowSpinner(false);
          Toasty({
            type: "error",
            message: `El Código OTP no es valido.`,
          })
        }
      } else {
        setShowSpinner(false);
        Toasty({
          type: "error",
          message: `${res.DataBeanProperties.ErrorMessage}`,
        })
      }
    })
  }


  /*   //VALIDA EL CODIGO OTP, SI ES CORRECTO SE LOGEA CON EXITO
    const login = (values: any) => {
  
      setShowSpinner(true);
      _AdminService
        .validateAccountFromNit(Number(values.identification))
        .subscribe((res: any) => {
          if (res.DataBeanProperties.ObjectValue) {
            setShowSpinner(false);
            localStorage.setItem("usuario", JSON.stringify(res.DataBeanProperties.ObjectValue));
            localStorage.setItem("token", JSON.stringify(true));
            Toasty({ type: "success", message: "Logeado con exito" });
            props.setIsLogged(true);
            setShowSpinner(false);
            navigate('/dashboard')
          } else {
            setShowSpinner(false);
            setShowSpinner(false);
            Toasty({
              type: "error",
              message: "La identificación es incorrecta",
            });
          }
        });
    };
   */



  return (
    <div className="main-container">
      {/* <div className="leyenda-advantage">Desarrollado por  <a href="https://advantage.com.co/#">Advantage Microsystem</a></div> */}

      <div className="caja-secondary">
        <div className="container-video">
          <div className="caja-video">
            <div className="caja-logo">
              <img src={imageIcon} />
            </div>
            <iframe src="https://www.youtube.com/embed/SssYi7KX6l8?autoplay=1&loop=1&controls=0"></iframe>
          </div>
        </div>

        <div className="login-box">
          <h1 className="titulo-login" style={sizeTitle}>
            Iniciar Sesión
          </h1>
          <div>
            <p
              className="description-login"
              style={{ height: heightDescription }}
            >
              La Caja Promotora de Vivienda Militar y de Policía entrega
              soluciones de vivienda y administra los aportes de los afiliados,
              con transparencia, efectividad y enfoque digital, soportado en un
              equipo humano con vocación de servicio, espíritu innovador y
              liderazgo, para satisfacción y bienestar de los miembros de la
              Fuerza Pública.{" "}
            </p>
            {showDescription && (
              <span onClick={MostrarDescripcion} className="leermas">
                Leer mas..
              </span>
            )}
          </div>
          {showText && (
            <p>
              Para asignarse una cita virtual por favor completar los campos de
              abajo.
            </p>
          )}

          <Formik
            initialValues={{ identification: "", code_otp: "" }}
            validate={(values) => {
              let erros: any = {};
              if (!values.identification) {
                erros.identification = "Campo requerido";
              }
              if (!values.code_otp) {
                erros.code_otp = "Campo requerido";
              }
              return erros;
            }}
            onSubmit={(values) => {
              validateOTP(values);
            }}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col sm={12}>
                    <label style={{ margin: "10px 0px" }}>Identificación</label>
                    <InputText
                      value={values.identification}
                      name="identification"
                      type="number"
                      onChange={handleChange}
                      style={{ width: "100%" }}
                      disabled={disableInput}
                    />
                    <span className="error">
                      {touched.identification && errors.identification}
                    </span>
                    {showOPN && (
                      <>
                        <Button
                          type="submit"
                          label="Generar Código OTP"
                          className="btn-opn"
                          style={{ display: "block" }}
                          disabled={!polCheck}
                          onClick={() => {
                            setShowPolitic(false);
                            sendOTP(Number(values.identification));
                          }}
                        />
                        {/* Cambio de div */}
                        {/* <div className="col-12 mt-3" style={{display:'flex',alignItems:'center'}}>
                          <Checkbox
                            inputId="cb1"
                            value="New York"
                            checked={true}
                          ></Checkbox>
                          <label htmlFor="cb1" className="p-checkbox-label" style={{marginLeft:10}} >
                          Acepto la política de privacidad. Puede leerla accediendo a <a href="https://www.cajahonor.gov.co/Paginas/Politica-de-Protecci%C3%B3n-de-Datos.aspx">Política de privacidad</a>
                           </label>
                        </div> */}
                      </>
                    )}

                  </Col>
                  {!showOPN && (
                    <Col sm={12}>
                      <label style={{ margin: "10px 0px" }}>Código OTP</label>
                      <InputText
                        value={values.code_otp}
                        name="code_otp"
                        type="number"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                      <span className="error" style={{ display: "block" }}>
                        {touched.code_otp && errors.code_otp}
                      </span>

                      <strong style={{ position: "relative", top: "3px" }}>
                        {cronometro}
                      </strong>
                      <p className="message-opn">
                        {" "}
                        Se envio un código OTP a tu numero de celular, ¿Todavia
                        no se recibe el codigo, por favor?{" "}
                        <span style={{ color: "rgb(0, 65, 139)" }} onClick={() => { sendOTP(NIT); }}>Reenviar código OTP</span>
                      </p>
                      {showPolitic && <div className="col-12 mt-3" style={{ display: 'flex', alignItems: 'center' }}>
                        <Checkbox
                          inputId="cb1"
                          onChange={() => {
                            setPolCheck(!polCheck);
                          }}
                          checked={polCheck}
                        ></Checkbox>
                        <label htmlFor="cb1" className="p-checkbox-label" style={{ marginLeft: 10 }} >
                          Acepto la Política de Protección de Datos. Puede leerla accediendo a <a href="https://www.cajahonor.gov.co/Paginas/Politica-de-Protecci%C3%B3n-de-Datos.aspx">Política de Protección de Datos <i className="pi pi-external-link" ></i></a>
                        </label>
                      </div>}
                    </Col>
                  )}
                </Row>
                {!showOPN && (
                  <>
                    <Button
                      type="submit"
                      label="Validar OTP"
                      className="btn-submit"
                    />
                  </>
                )}
              </form>
            )}
          </Formik>
        </div>
      </div>
      {showSpinner && <Spinner show={showSpinner} />}
    </div>
  );
};

export default Login;