export function verifyEmail(email) {
    //This just verifies that the string follows the format anystring@anystring.anystring
    //This must also be checked in the backend by attempting to send an email to the address
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function verifyPassword(password) {
    //This regex ensures a length of at least 8, at least one number, and at least one special character
    //It is being used temporarily, and may be changed later to instead use other rules
    const passRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return passRegex.test(password)
}

export function passRuleBroken(password) {
    const lengthReg = /^.{8,}$/
    const invalidCharReg = /^[A-Za-z\d@$!%*#?&]+$/
    const digitReg = /.*(?=.*\d).*/
    const specialReg = /.*[@$!%*#?&].*/
    if(!lengthReg.test(password)) {
        return "Your password needs to be at least 8 characters long."
    } else if(!invalidCharReg.test(password)) {
        return "Your password can only contain letters, numbers, and special characters @ $ ! % * # ? &."
    } else if(!digitReg.test(password)) {
        return "Your password must contain at least one number"
    } else if(!specialReg.test(password)) {
        return "Your password must contain at least one special character from @ $ ! % * # ? &."
    }
    return "No Error"
}

export {verifyEmail,verifyPassword,passRuleBroken}
