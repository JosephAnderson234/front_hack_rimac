export interface LoginRequest {
    correo: string,
    contrasena: string
}

export interface RegisterRequest{
    correo: string,
    contrasena: string,
    nombre: string,
    sexo: string
}

export interface AuthResponse{
    message: string,
    usuario: {
        correo: string,
        nombre: string,
        sexo: string,
        rol: string
    }
    access_token: string,
    id_token: string
}