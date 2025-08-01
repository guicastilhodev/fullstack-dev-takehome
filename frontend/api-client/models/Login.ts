/* tslint:disable */
/* eslint-disable */
/**
 * Quote Portal API
 * API documentation for Quote Portal
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Login
 */
export interface Login {
    /**
     * 
     * @type {string}
     * @memberof Login
     */
    username: string;
    /**
     * 
     * @type {string}
     * @memberof Login
     */
    password: string;
}

/**
 * Check if a given object implements the Login interface.
 */
export function instanceOfLogin(value: object): value is Login {
    if (!('username' in value) || value['username'] === undefined) return false;
    if (!('password' in value) || value['password'] === undefined) return false;
    return true;
}

export function LoginFromJSON(json: any): Login {
    return LoginFromJSONTyped(json, false);
}

export function LoginFromJSONTyped(json: any, ignoreDiscriminator: boolean): Login {
    if (json == null) {
        return json;
    }
    return {
        
        'username': json['username'],
        'password': json['password'],
    };
}

export function LoginToJSON(json: any): Login {
    return LoginToJSONTyped(json, false);
}

export function LoginToJSONTyped(value?: Login | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'username': value['username'],
        'password': value['password'],
    };
}

