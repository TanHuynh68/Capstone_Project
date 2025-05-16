import { Loading } from "@/components/atoms/login/Loading";
import ENV from "@/config/env";
import { PATH } from "@/routes/path";
import WalletService from "@/services/WalletService";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PayOsPaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate()
    const fullUrl = window.location.href;

    let baseUrl = `${ENV.PAYMENT_REDIRECT_URL}/api/v1/`;

    // Cắt phần "http://localhost:5173/" ra khỏi URL
    const urlWithoutBase = fullUrl.replace(baseUrl, '');
    const { getPayosCallback } = WalletService()
    const code = searchParams.get('code');
    const status = searchParams.get('status');
    useEffect(() => {

        console.log('code: ', code)
        console.log('status: ', status)
        // Set a 3-second delay before processing the redirect
        const timer = setTimeout(async () => {
            switch (code) {
                case '00':
                    if (status != 'CANCELLED') {
                        const response = await getPayosCallback(urlWithoutBase)
                        console.log('response: ', response)
                        if (response) {
                            window.location.href = `${ENV.PAYMENT_REDIRECT_URL + '/' + PATH.PAYMENT_SUCCESS
                                + '?code=' + code + "&status=" + status
                                }`;
                        } else {
                            // nếu đã callback nhưng vẫn cố tình gọi api sẽ đã về home và in ra lỗi
                            navigate(PATH.HOME)
                        }
                    } else {
                        const response = await getPayosCallback(urlWithoutBase)
                        if (response) {
                            window.location.href = `${ENV.PAYMENT_REDIRECT_URL + '/' + PATH.PAYMENT_FAILED
                                + '?code=' + code + "&status=" + status
                                }`
                        } else {
                            // nếu đã callback nhưng vẫn cố tình gọi api sẽ đã về home và in ra lỗi
                            navigate(PATH.HOME)
                        }
                    }
                    break;
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

export default PayOsPaymentResult
