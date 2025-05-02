import { Loading } from "@/components/atoms/Loading";
import ENV from "@/config/env";
import { PATH } from "@/routes/path";
import WalletService from "@/services/WalletService";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const queryString = window.location.search; // lấy phần ?userId=...&...
    const urlParams = new URLSearchParams(queryString);
    const navigate = useNavigate()
    // lấy từng biến
    const userId = urlParams.get('userId');
    const depositMoney = urlParams.get('depositMoney');
    const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
    const fullUrl = window.location.href;
    let baseUrl = `${ENV.PAYMENT_REDIRECT_URL}/api/v1/`;


    const urlWithoutBase = fullUrl.replace(baseUrl, '');

    console.log('userId: ', userId)
    const { getVnpayCallback } = WalletService()
    useEffect(() => {

        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        console.log('vnp_ResponseCode: ', vnp_ResponseCode)
        // Set a 3-second delay before processing the redirect
        const timer = setTimeout(async () => {
            // payment success
            if (vnp_ResponseCode === '00') {
                const response = await getVnpayCallback(urlWithoutBase)
                console.log('response: ', response)
                if (response) {
                    window.location.href = `${ENV.PAYMENT_REDIRECT_URL + '/' + PATH.PAYMENT_SUCCESS + '?depositMoney=' + depositMoney
                        + '&vnp_TransactionNo=' + vnp_TransactionNo
                        }`;
                } else {
                    navigate(PATH.HOME)
                }
            }else{
                const response = await getVnpayCallback(urlWithoutBase)
                console.log('response: ', response)
                if (response) {
                    window.location.href = `${ENV.PAYMENT_REDIRECT_URL + '/' + PATH.PAYMENT_FAILED + '?depositMoney=' + depositMoney
                        + '&vnp_TransactionNo=' + vnp_TransactionNo
                        }`;
                } else {
                    navigate(PATH.HOME)
                }
            }
        }, 2000);

        // Cleanup the timer if the component unmounts before the delay completes
        return () => clearTimeout(timer);
    }, [searchParams, navigate]);

    return (
        <>
            <Loading />
        </>
    )
}

export default PaymentResult
