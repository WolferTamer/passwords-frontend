//At the moment You need to copy/paste the functions into this file in order to run the test

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

function testEmail(email, expected) {
    const result = verifyEmail(email)
    if(result != expected) {
        console.log(`Failed Email Verification: ${email} expected "${expected}" but got ${result}`)
    }
}

function testPassword(password, expected1, expected2) {
    const result1 = verifyPassword(password)
    if(expected1 != result1) {
        console.log(`Failed Password Verification: ${password} expected "${expected1}" but got ${result1}`)
    }
    const result2 = passRuleBroken(password) 
    if(result2 !== expected2) {
        console.log(`Failed Password Rule Check: ${password} expected "${expected2}" but got ${result2}`)
    }
}

testEmail("caleb@gmail.com", true)
testEmail("rt235@y.a", true)
testEmail("no@y.y.", true)
testEmail("@cool.com", false)

testPassword('fg1356819#',true,"No Error")
testPassword('fg1356819',false,"Your password must contain at least one special character from @ $ ! % * # ? &.")
testPassword('fggjshgasgs#',false,"Your password must contain at least one number")
testPassword('fg1356819)',false,"Your password can only contain letters, numbers, and special characters @ $ ! % * # ? &.")
testPassword('fg135#',false,"Your password needs to be at least 8 characters long.")