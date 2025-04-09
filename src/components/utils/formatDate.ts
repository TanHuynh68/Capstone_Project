import moment from "moment"
/**
 * 
 * @param date 
 * @returns 
 */
export const formatDate = (date: string) => {
    return moment(date).format("DD/MM/YYYY");
}

/**
 * 
 * @param response 
 * @returns 
 */
export const formatCreatedAt = (response: any) => {
    const sortedData = response.data.sort(
        (a: any, b: any) => moment(b.createdAt).unix() - moment(a.createdAt).unix()
    );
    return sortedData;
}


