import axios, { AxiosInstance } from 'axios';

export interface HttpClient extends AxiosInstance {};

export const HTTP_TYPES = {
    HttpClient: Symbol.for('HttpClient')
}

export const httpClient: HttpClient = axios.create({
    baseURL: 'https://jsonplaceholder.typicode.com',
});