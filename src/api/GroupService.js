import axios from 'Plugins/axios'

export async function GetGroupList() {
    return await axios.get('/groups')
}

export default {
    GetGroupList
}