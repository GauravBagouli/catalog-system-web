import { Base64 } from 'js-base64';

export const encodeData = (payload: any) => {
    try {
        let dataString = Base64.btoa(encodeURI(JSON.stringify(payload)));
        dataString = dataString.replace(/=+$/, '');
        return dataString;
    } catch (error) {
        return error;
    }
};

export const decodeData = (token: string) => {
    try {
        if (!token) {
            return '';
        }
        const payload = JSON.parse(decodeURI(Base64.atob(token)));
        return payload;
    } catch (error) {
        return error;
    }
};
