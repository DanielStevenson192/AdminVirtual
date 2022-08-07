import { FC } from "react";
import { Col, Row } from "react-bootstrap";

interface Props {
    setSpinner: any;
}

export const ConfirmScheduleAppointment: FC<Props> = () => {
    return (
        <>
            <Row className="letter">
                <Col sm={12} className="letter_text">
                    <h1>Tu cita ha sido confirmada</h1>
                    <h2>Hola <b>Daniel Stevenson Avila Rios </b> 
                            tu cita virtual ha sido confirmada 
                            para el <b>Día Lunes 7 de Junio, 2022 a las 10:00</b>.</h2>
                    <h2>Ten en cuenta los siguientes detalles.</h2>
                    <ul>
                        <li>Podras acceder 5 minutos antes a tu cita.</li>
                        <li>Lo maximo que puede esperar el asesor son 5 minutos.</li>
                        <li>Recuerda calificar el servicio al finalizar la atención.</li>
                        <li>Si tienes alguna sugerencia puedes llamar a las siguientes lineas telefonicas</li>
                    </ul>
                </Col>
            </Row>
        </>
    )
};