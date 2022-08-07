import "./App.css";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import {
  ConfirmScheduleAppointment,
  DatingList,
  RequestTicket,
  ScheduleAppointment,
} from "./modules/components";

import { Home } from "./modules/pages/Home";
import { Login } from "./core/auth/Login";
import { useState } from "react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { FormDiary } from "./modules/components/FormDiary";
import { Template } from "./modules/pages/Template";
import icontec from './assets/footer/01_ICONTEC.png'
import gsed from './assets/footer/logo_gsed.svg'
import corazon from './assets/footer/logoCorazon.png'
import iso27001 from './assets/footer/LOGOS CALIDAD_ATNCION EN LINEA.svg'
import iso9001 from './assets/footer/LOGOS CALIDAD_Mesa de trabajo 1.svg'
import iso4500 from './assets/footer/LOGOS CALIDAD-03.svg'
import norton from './assets/footer/descarga.png'
import iqnet from './assets/footer/LOGOS CALIDAD-04.svg'
import "./modules/styles/footer.css";
import { Col, Row } from "react-bootstrap";
import { RequestProcedure } from './modules/components/RequestProcedure';
import { Procedure } from "./modules/components/Procedure";
import { MyProcedure } from "./modules/components/MyProcedures";
import { RejectProcedure } from "./modules/components/RejectProcedure";




function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>("");
  useEffect(() => {
    // funcionInit();
    if (localStorage.getItem("token")) {
      setIsLogged(true);
    }
    if (localStorage.getItem("usuario")) {
      setUser(JSON.parse(localStorage.getItem("usuario") || ""));
    }
  }, []);

  const funcionInit = () => {
    const onUbicacionConcedida = (ubicacion: any) => { };

    const onErrorDeUbicacion = (err: any) => { };

    const opcionesDeSolicitud = {
      enableHighAccuracy: true, // Alta precisión
      maximumAge: 0, // No queremos caché
      timeout: 5000, // Esperar solo 5 segundos
    };
    // Solicitar
    navigator.geolocation.getCurrentPosition(
      onUbicacionConcedida,
      onErrorDeUbicacion,
      opcionesDeSolicitud
    );
  };

  return (
    <>
      <HashRouter >
        {/* {isLogged && <Navbar setIsLogged={setIsLogged} />} */}
        <Routes>
          {!isLogged && (
            <Route index element={<Login setIsLogged={setIsLogged} />} />
          )}
          {isLogged && (
            <>
              <Route
                path="/dashboard"
                element={<Home setIsLogged={setIsLogged} />}
              />
              <Route
                path="/dating-list"
                element={
                  <Template setIsLogged={setIsLogged} Componente={DatingList} />
                }
              />
              <Route
                path="/assign-appointment"
                element={
                  <Template setIsLogged={setIsLogged} Componente={FormDiary} />
                }
              />
              <Route
                path="/schedule-appointment"
                element={
                  <Template
                    setIsLogged={setIsLogged}
                    Componente={ScheduleAppointment}
                  />
                }
              />
              <Route
                path="/request-ticket"
                element={
                  <Template
                    setIsLogged={setIsLogged}
                    Componente={RequestTicket}
                  />
                }
              />
              <Route
                path="/request-procedure"
                element={
                  <Template
                    setIsLogged={setIsLogged}
                    Componente={RequestProcedure}
                  />
                }
              />
              <Route
                path="/procedure"
                element={
                  <Template
                    setIsLogged={setIsLogged}
                    Componente={Procedure}
                  />
                }
              />
              <Route
                path="/my-procedure"
                element={
                  <Template
                    setIsLogged={setIsLogged}
                    Componente={MyProcedure}
                  />
                }
              />
              <Route
                path="/reject-procedure"
                element={
                  <Template
                    setIsLogged={setIsLogged}
                    Componente={RejectProcedure}
                  />
                }
              />
            </>
          )}

          <Route
            path="/*"
            element={
              isLogged ? (
                <Navigate to='/dashboard' />
              ) : (
                <Login setIsLogged={setIsLogged} />
              )
            }
          />
        </Routes>
      </HashRouter>


      <Row className="capa-1">
        <Col sm={12} md={12} xl={6} xxl={9}>
          <Row>
            <Col sm={12} md={6} xl={6} xxl={3} className="capa-1-col-1">
              <strong>CAJA PROMOTORA DE VIVIENDA MILITAR Y POLICÍA</strong>
              <li>Sede principal Bogotá: Cr 54 N° 26 - 54 CAN</li>
              <li>Centro de Contacto al Ciudadano: <br /> (601) 755 7070</li>
              <li>Línea gratuita: 01 8000 185570</li>
            </Col>
            <Col sm={12} md={6} xl={6} xxl={3} className="capa-1-col-2">
              <strong>PARA PETICIONES QUEJAS Y RECLAMOS</strong>
              <li>Utilizar nuestro PQRS-D</li>
              <li>NOTIFICACIONES JUDICIALES</li>
              <li>notificaciones.judiciales@cajahonor.gov.co</li>
            </Col>


            <Col sm={12} md={6} xl={6} xxl={3} className="capa-1-col-3">

              <Row>
                <Col md={6}>
                  <li>Armada Nacional</li>
                  <li>Ejército Nacional</li>
                  <li>Mindefensa</li>
                </Col>
                <Col md={6}>
                  <li>Enlaces</li>
                  <li>Policía Nacional</li>
                  <li>Fuerza Aérea</li>
                </Col>
              </Row>

            </Col>
            <Col sm={12} md={6} xl={6} xxl={3} className="capa-1-col-4">
              <img src={gsed} className="imagen-footer-1" />
              <img src={corazon} className="imagen-footer-2" />
            </Col>

          </Row>
        </Col>

        <Col sm={12} md={12} xl={6} xxl={3} className="capa-2-col-1">
          <img className="imagen-footer-3 img-fluid" src={iso27001} />
          <img className="imagen-footer-5 img-fluid" src={iso9001} />
          <img className="imagen-footer-7 img-fluid" src={iso4500} />
          <img className="imagen-footer-6 img-fluid" src={norton} />
          <img className="imagen-footer-4 img-fluid" src={iqnet} />


        </Col>
        <div className="footer-pie">Política de protección de datos <strong className="ml-4">ADVANTAGE MICROSYSTEMS COLOMBIA LTDA  - 2022</strong></div>
      </Row>

      <Toaster position="top-right" />
    </>
  );
}

export default App;
