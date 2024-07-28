<template>
  <v-dialog
        v-model="dialogUploadContact"
        @click:outside="closeDialog(false)"
    >
    <v-card
        class="mx-auto w-50"
        prepend-icon="mdi-file-account"
        title="Upload Contact"
        width="400"
    >
        <template v-slot:subtitle>
            <div v-if="loading" class="spinner-container">
                <v-progress-circular indeterminate :size="30" :width="5"></v-progress-circular>
            </div>
            <span class="font-weight-black">upload using json or excel</span>
        </template>

        <v-card-text class="bg-surface-light pt-2">
            <!-- <v-btn @click="triggerFileUploadJsonVue">Upload Json (Vue)</v-btn>
            <v-file-input
                accept=".json"
                color="error"
                ref="fileInputJsonVue"
                class="hidden-lg"
                @change="readJsonWithVue"
            ></v-file-input> -->

            <div class="d-flex">
                <v-btn class="me-2" @click="triggerFileUploadJsonApi" color="primary">Upload JSON</v-btn>
                <v-file-input
                    id="uploadJson"
                    accept=".json"
                    color="error"
                    ref="fileInputJsonApi"
                    class="hidden-lg"
                    @change="readJsonWithApi"
                ></v-file-input>

                
                <v-btn @click="triggerFileUploadExcelApi" color="primary">Upload Excel</v-btn>
                <v-file-input
                    id="uploadExcel"
                    accept=".xlsx,.xls,.csv"
                    color="error"
                    ref="fileInputExcelApi"
                    class="hidden-lg"
                    @change="readExcelWithApi"
                ></v-file-input>
            </div>

            <div v-if="uploadContacts && uploadContacts.length > 0" class="mt-3">
                <v-data-table :headers="contactHeaders" 
                    :items="uploadContacts"
                    :hide-default-footer="true"
                    style="max-height: 300px; overflow: auto;"
                >
                    <template v-slot:item="{ item, index }">
                    <tr>
                        <td>{{ index+1 }}</td>
                        <td>{{ item.name }}</td>
                        <td>{{ item.phone_number }}</td>
                        <td>{{ item.address }}</td>
                        <td>{{ item.group_name }}</td>
                    </tr>
                    </template>
                </v-data-table>
            </div>
            
            <v-card-actions class="mt-2 justify-content-end" v-if="uploadContacts && uploadContacts.length > 0">
                <v-btn
                    color="success"
                    text="Submit"
                    variant="outlined"
                    @click="apiPostContactList()"
                ></v-btn>
            </v-card-actions>
        </v-card-text>
    </v-card>
    </v-dialog>
</template>

<script>
import { PostContactList } from 'Api/ContactService'
import { PostUploadJson, PostUploadExcel } from 'Api/UploadService'
import Swal from 'sweetalert2'

export default {
    props: {
        propsDialogUploadContact: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        dialogUploadContact: false,
        loading: false,
        contactHeaders: [
            { title: 'No', key: 'index' },
            { title: 'Name', key: 'name' },
            { title: 'Phone Number', key: 'phone_number' },
            { title: 'Address', key: 'address' },
            { title: 'Group', key: 'group_name' },
        ],
        uploadContacts: null
    }),
    watch: {
        propsDialogUploadContact (newVal) {
            this.dialogUploadContact = newVal
        }
    },
    methods: {
        triggerFileUploadJsonApi() {
            this.$refs.fileInputJsonApi.click()
        },
        triggerFileUploadExcelApi() {
            this.$refs.fileInputExcelApi.click()
        },
        readJsonWithVue(e) {
            const file = event.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                    try {
                        this.uploadContacts = JSON.parse(e.target.result)
                    } catch (error) {
                        console.error("Invalid JSON file")
                    }
                }
                reader.readAsText(file)
            }
        },
        readJsonWithApi(e) {
            this.loading = true
            this.uploadContacts = []
            var files = e.target.files || e.dataTransfer.files
            if (!files.length)
                return

            var reader = new FileReader()
            reader.readAsDataURL(files[0])
            
            let formContactJson = new FormData()
            formContactJson.append('file', files[0], files[0].name)
            
            PostUploadJson(formContactJson)
                .then((response) => {
                    this.loading = false
                    this.uploadContacts.push(...response.data.data);
                    document.getElementById('uploadJson').value = ''
                })
                .catch((error) => {
                    this.loading = false
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: error.response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    document.getElementById('uploadJson').value = ''
                })
        },
        readExcelWithApi(e) {
            this.loading = true
            this.uploadContacts = []
            var files = e.target.files || e.dataTransfer.files
            if (!files.length)
                return

            var reader = new FileReader()
            reader.readAsDataURL(files[0])
            
            let formContactJson = new FormData()
            formContactJson.append('file', files[0], files[0].name)
            
            PostUploadExcel(formContactJson)
                .then((response) => {
                    this.loading = false
                    this.uploadContacts.push(...response.data.data);
                    document.getElementById('uploadExcel').value = ''
                })
                .catch((error) => {
                    this.loading = false
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: error.response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                    document.getElementById('uploadExcel').value = ''
                })
        },
        apiPostContactList() {
            this.loading = true
            PostContactList(this.uploadContacts)
                .then((response) => {
                    this.loading = false
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Contact has been saved",
                        showConfirmButton: false,
                        timer: 1500
                    }).then((result) => {
                        this.closeDialog(true)
                    })
                })
                .catch((error) => {
                    this.loading = false
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: error.response.data.message,
                        showConfirmButton: false,
                        timer: 1500
                    })
                })
        },
        closeDialog(refresh) {
            this.$emit('emitCloseDialogUpload', refresh)
        },
    }
}
</script>
