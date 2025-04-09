interface ItemWithCreatedAt {
    createdAt: string;
    [key: string]: any; // để linh hoạt thêm các field khác như id, name,...
};
