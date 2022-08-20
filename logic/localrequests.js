import request from "request"

export const post_req = async (port, path, data) => {
    await request.post(
        process.env.HOST_ADDRESS + ':'+ port + path,
        { json: data },
        async function (error, response, body) {
            if (!error && response.statusCode == 200) {
                return await body
            }
    })
}