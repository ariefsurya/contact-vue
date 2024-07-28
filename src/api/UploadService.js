import axios from 'Plugins/axios'

export async function PostUploadJson(jsonDataRequest) {
    return await axios.post('/uploadJson', jsonDataRequest)
}

export async function PostUploadExcel(jsonDataRequest) {
    return await axios.post('/uploadExcel', jsonDataRequest)
}
