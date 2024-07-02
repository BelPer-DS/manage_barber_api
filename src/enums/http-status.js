export const httpstatus = {
    S_201_CREATE : {
        status:201,
        message: 'Created'
    },
    S_500_ERROR :{
        status: 500,
        message: 'Internal server error'
    },
    S_200_FOUND :{
        status: 200,
        data:{}
    },
    S_401_UNAUTHORIZED:{
        status: 401,
        message: 'Unauthorized'
    },
    S_404_NOT_FOUND :{
        status: 404,
        message: "Not found"
    },
    S_404_NO_RESULT:{
        status: 404,
        message: "No results for this search"
    },
    S_400_BAD_REQUEST:{
        status: 400,
        message: 'Bad Request'
    },
    S_409_CONFLICT :{
        status: 409,
        message: 'Conflict'
    },
    S_409_CONFLICT_EXIST :{
        status: 409,
        message: 'The record already exists'
    }
    
}