import axios from 'Plugins/axios'

export async function GetContactList(search, groupId, iPage, iTake) {
    return await axios.get('/contacts?group_id='+ groupId +'&search='+ search +'&iPage='+ iPage +'&iTake='+ iTake)
}

export async function GetContactDetail(id) {
    return await axios.get('/contacts/'+ id)
}

export async function AddContactDetail(jsonDataRequest) {
    return await axios.post('/contacts', jsonDataRequest)
}

export async function UpdateContactDetail(id, jsonDataRequest) {
    return await axios.put('/contacts/'+ id, jsonDataRequest)
}

export async function DeleteContactDetail(id) {
    return await axios.delete('/contacts/'+ id)
}

export async function PostContactList(jsonDataRequest) {
    return await axios.post('/contactList', jsonDataRequest)
}
