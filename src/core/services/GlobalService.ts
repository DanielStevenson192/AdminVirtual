import { Observable, map } from "rxjs";
import http from "../services/api/api";


export class GlobalService {
  private url = "/quickturn/jsserver";

  public getAppointmentByAccount(
    initialDate: any,
    finalDate: any,
    id: number
  ): Observable<any> {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "QuickTurnService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getAppointmentByAccount_java.util.Date_java.util.Date_Number_Number",
      ArgumentList: [initialDate, finalDate, id, 0],
    };
    const data = JSON.stringify(dataObj);
    console.log(data);
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
  public createAttentionTicketFromAppointment(
    id: number,
    date: any
  ): Observable<any> {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "QuickTurnService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickturn.bean.AttentionTicket_createAttentionTicketFromAppointment_Number_java.util.Date",
      ArgumentList: [id, date],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data).pipe(
      map((value: any) => {
        if(value.DataBeanProperties.ErrorMessage){
          return value.DataBeanProperties
        }
        return value.DataBeanProperties.ObjectValue.DataBeanProperties;
      })
    );
  }

  public cancelAppointment(
    idAppointment: number,
    date: string,
    idUser: number,
    description: string
  ): Observable<any> {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "QuickTurnService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "com.quickturn.bean.Appointment_cancelAppointment_Number_java.util.Date_Number_String",
      ArgumentList: [idAppointment, date, idUser, description],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }
  public getAppointmentByAccountForToday(idUser: number): Observable<any> {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "QuickTurnService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash:
        "java.util.List_getAppointmentByAccountForToday_Number_Number",
      ArgumentList: [idUser, 0],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data).pipe(
      map((value: any) => {
        return value.DataBeanProperties.ObjectValue.map((value: any) => {
          return value.DataBeanProperties;
        });
      })
    );
  }
  public getOpenAttentionTicketListByAccount(idUser: number): Observable<any> {
    const dataObj = {
      IDClient: "$#HHJGUY9773H5MNKD65389745KJDFGDGG==",
      ServiceName: "QuickTurnService",
      WSToken: "$#HHJGUYUHSDFGS546546DFH654SGHUJJFF==",
      MethodHash: "java.util.List_getOpenAttentionTicketListByAccount_Number",
      ArgumentList: [idUser],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data).pipe(
      map((value: any) => {
        return value.DataBeanProperties.ObjectValue.map((value: any) => {
          return value.DataBeanProperties;
        });
      })
    );
  }
  public getCloseAttention(idTikect: any, idSession: any, calification: any):Observable<any> {
    console.log(idTikect, idSession, calification);
    const dataObj = {
      ServiceName: "QuickTurnService",
      MethodHash: "Integer_closeAttentionTicket_Number_Number_String",
      ArgumentList: [idTikect, idSession, calification],
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data);
  }

  public getSystemPropertyList():Observable<any>{
    const dataObj = {
      "ServiceName": "OrangeBase",
      "MethodHash": "java.util.List_getSystemPropertyList_Number",
      "ArgumentList": [
        null
      ]
    };
    const data = JSON.stringify(dataObj);
    return http.post(this.url, data).pipe(
      map((value: any) => {
        return value.DataBeanProperties.ObjectValue.map((value: any) => {
          return value.DataBeanProperties;
        });
      })
    );;
  }


}


