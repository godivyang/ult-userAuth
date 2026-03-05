const getError = ({code="ERROR", message="Something went wrong."}) => {
    return {
        success: false,
        code,
        message
    }
}

const getSuccess = ({code="SUCCESS", message="Service executed successfully.", data=[]}) => {
    return {
        success: true,
        code,
        message,
        data
    }
}

export {getError, getSuccess}