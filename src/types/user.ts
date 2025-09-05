
export interface UserFullInfo {
  infomation: {
    accountID: string;
    fullName: string;
    phoneNumber: string;
    email: string;
    avatar: string;
    genderDisplay: string;
    roleDisplay: string;
    isActive: boolean;
    isVerify: boolean;
    createdAt: string;
  };
  addresses: Array<{
    addressID: number;
    province: number;
    district: number;
    ward: number;
    addressDetail: string;
    isMainAddress: boolean;
  }>;
  wallet: {
    balance: number;
    locked: number;
    bankAccountNumber: string | null;
    bankName: string | null;
    accountHolderName: string | null;
  };
  deposits: Array<{
    orderDepositID: string;
    orderID: string;
    title: string;
    amount: number;
    type: string;
    depositAt: string;
  }>;
}

export interface UserFullInfoResponse {
  isSuccess: boolean;
  message: string;
  statusCode: number;
  responseRequestModel: UserFullInfo;
}

