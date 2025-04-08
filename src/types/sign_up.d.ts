interface RegisterPayload {
    fullName: string;
    password: string;
    phoneNumber: string;
    email: string;
    gender: Gender; // integer (int32), có thể là 0: Male, 1: Female, v.v.
    role: Role;   // integer (int32), tùy theo hệ thống phân quyền
}

enum Gender {
    Male = 0,
    Female = 1,
    Other = 2,
}

enum Role {
    Admin = 0,
    User = 1,
    Designer = 2,
    // Thêm các role khác tùy backend định nghĩa
}
