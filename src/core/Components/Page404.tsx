import imagen404 from "../../assets/img/error-404.png"

export const Page404 = () => {

    return (

        <section className="container-404">
            <div>
                <img src={imagen404} width={300} height={130} />
            </div>

            <h1>Esta ruta no existe por favor navega a una ruta existente.</h1>

        </section>

    )

}