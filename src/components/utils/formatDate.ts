import moment from "moment"

export const formatDate = (date: string) => {
    return moment(date).format("DD/MM/YYYY");
}

export const formatCreatedAt = (response: any) => {
    const sortedData = response.data.sort(
        (a: any, b: any) => moment(b.createdAt).unix() - moment(a.createdAt).unix()
    );
    return sortedData;
}

// Function to calculate expected delivery date
export function calculateExpectedDeliveryDate(dateOfPregnancyStart: string): string {
    const startDate = moment(dateOfPregnancyStart, 'YYYY-MM-DD');
    if (!startDate.isValid()) {
        throw new Error('Invalid pregnancy start date');
    }
    return startDate.add(280, 'days').format('YYYY-MM-DD');
}