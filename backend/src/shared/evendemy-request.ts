import { Request } from 'express';

/**
 * Keycloak will add a user object to each request.
 */
export class EvendemyRequest extends Request {
    user: {
        preferred_username: string,
        email: string,
        given_name: string,
        family_name: string
    };
}