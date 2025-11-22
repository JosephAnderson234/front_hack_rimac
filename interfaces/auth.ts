export interface LoginRequest {
    email: string,
    password: string
}

export interface RegisterRequest{
    email: string,
    password: string,
    name: string
}

export interface AuthRegisterResponse{
    message: string,
    usuario: {
        email: string,
        name: string,
        role: string,
        createdAt: string
    }
    access_token: string,  // Corregido: access_token con dos "s"
    id_token: string
}


export interface AuthLoginResponse{
    message: string,
    email: string,
    role: string,
    access_token: string,  // Corregido: access_token con dos "s"
    id_token: string
}