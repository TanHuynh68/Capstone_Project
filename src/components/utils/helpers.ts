
import { useSelector } from "react-redux";
import { WALLET_TRANSACTION_TYPE } from "@/constants";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { RootState } from "@/redux/store";
/**
 * Kiểm tra xem một object có rỗng không (không có key nào).
 * @param obj - object bất kỳ
 * @returns true nếu object rỗng
 */
export const isEmptyObject = (obj: object): boolean => {
    return Object.keys(obj).length === 0;
};

/**
 * Chuyển chuỗi thành dạng viết hoa chữ cái đầu mỗi từ.
 * @param str - chuỗi cần format
 * @returns Chuỗi sau khi format, ví dụ: "hello world" => "Hello World"
 */
export const capitalizeWords = (str: string): string => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Giới hạn độ dài chuỗi, thêm dấu "..." nếu vượt quá
 * @param str - chuỗi gốc
 * @param maxLength - độ dài tối đa
 * @returns chuỗi đã cắt
 */
export const truncate = (str: string, maxLength: number): string => {
    return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
};

/**
 * Delay một hành động theo số mili giây (dùng trong async/await)
 * @param ms - số mili giây delay
 * @returns Promise
 */
export const sleep = (ms: number): Promise<void> => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Chuyển chuỗi thành dạng slug (dùng cho URL)
 * @param str - chuỗi cần chuyển
 * @returns slug dạng url-friendly
 */
export const slugify = (str: string): string => {
    return str
        .toLowerCase()
        .normalize("NFD") // bỏ dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
};

/**
 * Random một ID đơn giản
 * @returns chuỗi ID ngẫu nhiên (vd: "a1b2c3")
 */
export const generateRandomId = (length: number = 6): string => {
    return Math.random().toString(36).substr(2, length);
};

/**
 * Format số thành dạng có dấu phân cách nghìn
 * @param value - số đầu vào
 * @returns chuỗi đã format (vd: 1000000 => "1,000,000")
 */
export const formatNumber = (value: number): string => {
    return value.toLocaleString("en-US");
};

/**
 * Kiểm tra email có hợp lệ không
 * @param email - chuỗi email cần kiểm tra
 * @returns true nếu hợp lệ
 */
export const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Hàm chuyển đổi
export const toLowerCase = (role: any): any => {
    const stringRole = role + ''
    return stringRole.toLowerCase();
}

/**
 * Hàm format tiền Việt Nam (VND):
 * @param amount 
 * @returns 
 */
export const formatCurrencyVND =(amount: number)=> {
    return amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTransactionTypeLabel = (type: WALLET_TRANSACTION_TYPE): string => {
    switch (type) {
      case WALLET_TRANSACTION_TYPE.Deposit:
        return "Nạp tiền"
      case WALLET_TRANSACTION_TYPE.Withdraw:
        return "Rút tiền"
      case WALLET_TRANSACTION_TYPE.Transfer:
        return "Chuyển tiền"
      case WALLET_TRANSACTION_TYPE.Receive:
        return "Nhận tiền"
      case WALLET_TRANSACTION_TYPE.PlaceDeposit:
        return "Đặt cọc"
      case WALLET_TRANSACTION_TYPE.RefundDeposit:
        return "Hoàn cọc"
      default:
        return "Không xác định"
    }
  }

  export const getTransactionTypeName = (type: string): string => {
    switch (type) {
      case 'Deposit':
        return "Nạp tiền"
      case 'Withdraw':
        return "Rút tiền"
      case 'Transfer':
        return "Chuyển tiền"
      case 'Receive':
        return "Nhận tiền"
      case 'PlaceDeposit':
        return "Đặt cọc"
      case 'RefundDeposit':
        return "Hoàn cọc"
      default:
        return "Không xác định"
    }
  }


export function getPaymentMethodFromDescription(description: string): string {
  if (description.includes("VNPay")) {
    return "VNPay"
  } else if (description.includes("PayOS")) {
    return "PayOS"
  } else if (description.includes("MoMo")) {
    return "MoMo"
  } else if (description.includes("ZaloPay")) {
    return "ZaloPay"
  } else {
    return "Khác"
  }
}

export function isDepositOrder(description: string): boolean {
  return description.includes("Nạp")
}

export function isWithdrawalOrder(description: string): boolean {
  return description.includes("Rút")
}

export function getOrderType(description: string): "Nạp tiền" | "Rút tiền" | "Khác" {
  if (isDepositOrder(description)) {
    return "Nạp tiền"
  } else if (isWithdrawalOrder(description)) {
    return "Rút tiền"
  } else {
    return "Khác"
  }
}

export function formatBankAccountNumber(accountNumber: string): string {
  return accountNumber.replace(/(.{4})/g, '$1 ').trim();
}

export const useCurrentUser = () => {
  const user = useSelector((store: any) => store.user);
  return user;
};

export const isLoggedIn = ()=>{
  const userInfo = useSelector((state: RootState) => state.user);
  if(userInfo && userInfo?.id != '') return true
  return false
}
