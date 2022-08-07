import toast from 'react-hot-toast';

export const ToastAlert = () => {


    interface Toasty {
        type: "success" | "error" | "warning",
        message: string

    }


    function Toasty(bean: Toasty) {
        if (bean.type === "success") {
            toast.success(bean.message);
        } else if (bean.type === "error") {
            toast.error(bean.message);
        } else {
            toast(bean.message, { icon: "🔔" });
        }
    }


    return { Toasty }


}