import { Request } from 'express';

/**
 * The plugin auth.js will always add the user object to each request.
 */
export class EvendemyRequest extends Request {
    user: {
        username: string,
        email: string,
        firstname: string,
        lastname: string
    };
    external: {
        email: string;
    }
}