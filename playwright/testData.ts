import 'dotenv/config';
interface TestData {
    url: string;
    users: Users;
}

interface Users {
    admin: Credentials;
}

interface Credentials {
    username: string;
    password: string;
}


export const testData: TestData = {
    url: process.env.BASE_URL as string,
    users: {
        admin: {
            username: process.env.ADMIN_USERNAME as string,
            password: process.env.ADMIN_PASSWORD as string,
        }
    }
}