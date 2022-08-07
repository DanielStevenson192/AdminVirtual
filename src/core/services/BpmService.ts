import { Observable, map } from "rxjs";
import http from "../services/api/api";

export class BpmService {
  private url = "/quickbpm/jsserver";

  getBusinessProcessCatalog(): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getBusinessProcessCatalog_Number_Boolean_Boolean_Number_Number_Number",
      ArgumentList: [null, null, null, null, null, null],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
      map((item: any) => {
        return item.DataBeanProperties.ObjectValue.map((element: any) => {
          return element.DataBeanProperties;
        });
      })
    );
  }

  /* 
    Tener en cuenta que el método original tiene los siguientes parametros
    idBusinessProcess: number,
    idOffice: number,
    accountID: number
    description: string,
    alphaCode: String,
    runNextStage: Boolean, 
    idCharacterization: number
  */

  public createBusinessProcessAndNextStage(
    idBusinessProcess: number,
    accountID: number,
    idCharacterization: number
  ): Observable<any> {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.ProcedureImp_createBusinessProcess_Number_Number_Number_String_String_Boolean_Number",
      ArgumentList: [
        idBusinessProcess,
        1,
        accountID,
        null,
        null,
        true,
        idCharacterization,
      ],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  public getProcedureActionByAccount(
    idAccount: number,
    idProcedureImp: number
  ): Observable<any> {
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

  public responseProcedureAction(idAction: number, responseValues: any) {
    const parametros = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "BpmService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickbpm.bean.ResponseValue_responseProcedureAction_Number_String_Boolean_java.util.Map_Boolean",
      ArgumentList: [idAction, null, null, responseValues, false],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data);
  }

  getProcedureImpRejectedForInput(idAccount: number): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureImpRejectedForInput_Number",
      ArgumentList: [idAccount],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
      map((item: any) => {
        return item.DataBeanProperties.ObjectValue.map((element: any) => {
          return element.DataBeanProperties;
        });
      })
    );
  }

  getProcedureActionRejected(
    idAccount: number,
    idProcedureImp: number
  ): Observable<any> {
    const parametros = {
      ServiceName: "BpmService",
      MethodHash: "java.util.List_getProcedureActionRejected_Number_Number",
      ArgumentList: [idAccount, idProcedureImp],
    };
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
      map((item: any) => {
        return item.DataBeanProperties.ObjectValue.map((element:any) => {
          return element.DataBeanProperties;
        });
      })
    );
  }
  getActualProcedureActionByProcedureImp(idProcedureImp:number): Observable<any> {
    
    const parametros = {
      "IDClient": "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      "ServiceName": "BpmService",
      "WSToken": "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      "MethodHash": "java.util.List_getActualProcedureActionByProcedureImp_Number",
      "ArgumentList": [
        idProcedureImp
      ]
    }
    const data = JSON.stringify(parametros);
    return http.post(this.url, data).pipe(
      map((item: any) => {
        return item.DataBeanProperties.ObjectValue.map((element: any) => {
          return element.DataBeanProperties;
        });
      })
    );
  }
}
