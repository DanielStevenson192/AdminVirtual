import { Observable, map } from "rxjs";
import http from "../services/api/api";

export class TrayService {
    private url = "/quickbpm/jsserver";

    getProcedureImpForInput(idAccount: number): Observable<any> {
        const parametros = {
            ServiceName: "BpmService",
            MethodHash:
                "java.util.List_getProcedureImpForInput_Number",
            ArgumentList: [idAccount],
        };
        const data = JSON.stringify(parametros);
        return http.post(this.url, data).pipe(
            map((item: any) => {
                return item.DataBeanProperties.ObjectValue.map((element: any) => {
                    return element.DataBeanProperties
                });
            })
        );
    }

    public getProcedureActionByAccount(idAccount: number, idProcedureImp: number): Observable<any> {
        const parametros = {
            ServiceName: "BpmService",
            MethodHash:
                "java.util.List_getProcedureActionByAccount_Number_Number_Number",
            ArgumentList: [idAccount, idProcedureImp, 0],
        };
        const data = JSON.stringify(parametros);
        return http.post(this.url, data).pipe(
            map((value: any) => {
                if (value) {
                    return value.DataBeanProperties.ObjectValue.map((value: any) => {
                        if (value) {
                            return value.DataBeanProperties;
                        }
                    });
                }
            })
        );
    }

}
