import React, { useEffect, useState } from "react";
import tramite from "../../assets/home/tramite.png";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "primereact/button";
import proceso from "../../assets/home/enproceso.png";
import devuelto from "../../assets/home/TRADEVUELTO.png";


interface IProcedure {

}

export const Procedure: React.FC<IProcedure> = (props: IProcedure) => {

    const navigate = useNavigate();
    const rutaActual = useLocation();
    const gestionarRutas = () => {
        if (rutaActual.pathname === "/procedure") {
            navigate("/dashboard");
        }
    }

    useEffect(() => {

    }, [])

    return (
        <>
            <div className="padre-servicios">
                <Button className="btn-atras btn-atras-2 px-4" icon="pi pi-arrow-left" label="Atras" onClick={gestionarRutas} />
                {/* Trámites en Proceso */}
                <div className="caja-servico flip-container">
                    <div
                        className="col-card card"
                        onClick={() => {
                            navigate("/my-procedure");
                        }}
                    >
                        <div className="envolver front">

                            <div className="row ">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="pad-img">
                                            {" "}
                                            <img className="img-fluid" src={proceso} style={{ maxHeight: 150 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="envolver back">
                            <div className="row ">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="card-atras p-3">
                                            Aqui podras encontrar los trámites que tienes en proceso
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Trámites Devueltos */}
                <div className="caja-servico flip-container">
                    <div
                        className="col-card card"
                        onClick={() => {
                            navigate("/reject-procedure");
                        }}
                    >
                        <div className="envolver front">
                            <div className="row ">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="pad-img">
                                            {" "}
                                            <img className="img-fluid" src={devuelto} style={{ maxHeight: 150 }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="envolver back">
                            <div className="row ">
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="card-atras p-3">
                                            Aquí puede consultar sus documentos devueltos
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};