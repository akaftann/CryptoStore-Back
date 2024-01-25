export class ApiError extends Error{
    constructor(status, message, errors = []){
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError(message, errors = []){
        return new ApiError(401, message, errors)
    }
    static BadRequest(message, errors = []){
        return new ApiError(400, message, errors)
    }
    static Conflict(){
        return new ApiError(409, "Such email already exists")
    }
    static NotFound(){
        return new ApiError(404, 'User not found')
    }

    static Forbidden(){
        return new ApiError(403, 'Access denied')
    }
}