"use server"
export default async function authentication(username: string, password: string) {
    const result = username === process.env.MYECO_USERNAME && password === process.env.MYECO_PASSWORD
    if (result) {
        return process.env.MYECO_WEB_TOKEN
    }
    return ''
}