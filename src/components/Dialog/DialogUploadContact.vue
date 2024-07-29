<template>
  <v-dialog
        v-model="dialogUploadContact"
        @click:outside="closeDialog(false)"
    >
    <v-card
        :class="['mx-auto', isMobile ? '' : 'w-50']"
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
                    class="d-none"
                    @change="readJsonWithApi"
                ></v-file-input>

                
                <v-btn @click="triggerFileUploadExcelApi" color="primary">Upload Excel</v-btn>
                <v-file-input
                    id="uploadExcel"
                    accept=".xlsx,.xls,.csv"
                    color="error"
                    ref="fileInputExcelApi"
                    class="d-none"
                    @change="readExcelWithApi"
                ></v-file-input>
            </div>
            <div v-if="uploadContacts && uploadContacts.length > 0" class="mt-3 hide-on-mobile">
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
                            <td>{{ item.address }}
                            </td>
                            <td>{{ item.group_name }}</td>
                        </tr>
                        <tr>
                            <td colspan="12" class="h-0">
                                <div class="small text-red d-flex">
                                    <i class="small mdi mdi-alert pe-1 text-red" v-if="v$.uploadContacts.$each.$response.$errors[index].name.length > 0">name is required</i>
                                    <i class="small mdi mdi-alert pe-1 text-red" v-if="v$.uploadContacts.$each.$response.$errors[index].address.length > 0">address is required</i>
                                    <i class="small mdi mdi-alert pe-1 text-red" v-if="v$.uploadContacts.$each.$response.$errors[index].phone_number.length > 0">phone_number {{ v$.uploadContacts.$each.$response.$errors[index].phone_number[0].$message }}</i>
                                </div>
                            </td>
                        </tr>
                    </template>
                </v-data-table>
            </div>
            <div v-if="uploadContacts && uploadContacts.length > 0" class="mt-3 show-on-mobile">
                <v-infinite-scroll
                    mode="manual"
                    max-height="300">
                    <template v-for="(item, index) in uploadContacts" :key="index">
                        <div :class="['px-2 d-flex', index % 2 === 0 ? 'bg-grey-lighten-2' : '']">
                            <div class="col-1"> {{ index+1 }}</div>
                            <div class="col-11 d-block"> 
                                <div class="d-flex justify-content-between align-center">
                                    <div class="align-center d-flex"><i class="fs-3 mdi mdi-account-circle pe-1"></i>{{ item.name }}</div>
                                    <div>
                                        <!-- <i class="fs-2 mdi mdi-account-multiple pe-1"></i> -->
                                        {{ item.group_name ? ('(' + item.group_name + ')') : "" }}
                                    </div>
                                </div>
                                <div class="align-center d-flex">
                                    <i class="fs-3 mdi mdi-phone pe-1"></i>{{ item.phone_number }}
                                </div>
                                <div class="align-center d-flex">
                                    <i class="fs-3 mdi mdi-map-marker pe-1"></i>{{ item.address }}
                                </div>

                                <div class="small text-red d-flex">
                                    <i class="small mdi mdi-alert pe-1 text-red" v-if="v$.uploadContacts.$each.$response.$errors[index].name.length > 0">name is required</i>
                                    <i class="small mdi mdi-alert pe-1 text-red" v-if="v$.uploadContacts.$each.$response.$errors[index].address.length > 0">address is required</i>
                                    <i class="small mdi mdi-alert pe-1 text-red" v-if="v$.uploadContacts.$each.$response.$errors[index].phone_number.length > 0">phone_number {{ v$.uploadContacts.$each.$response.$errors[index].phone_number[0].$message }}</i>
                                </div>
                            </div>
                        </div>
                    </template>
                </v-infinite-scroll>
            </div>
            
            <v-card-actions class="mt-2 justify-content-end" v-if="uploadContacts && uploadContacts.length > 0">
                <v-btn
                    :disabled="loading"
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
import { useVuelidate } from '@vuelidate/core'
import { helpers, required, minLength, maxLength } from '@vuelidate/validators'

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
        uploadContacts: [],
    }),
    validations() {
        return {
            uploadContacts: {
                $each: helpers.forEach({
                    name: { required },
                    phone_number: { required, minLength: minLength(8), maxLength: maxLength(13) },
                    address: { required }
                })
            }
        }
    },
    setup() {
        const v$ = useVuelidate()
        return { v$ }
    },
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
        async apiPostContactList() {
            const isFormCorrect = await this.v$.$validate()
            if (isFormCorrect) {
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
            }
        },
        closeDialog(refresh) {
            this.$emit('emitCloseDialogUpload', refresh)
        },
        getError(index, field) {
            const errors = this.v$.uploadContacts.$each[index]?.$errors || {};
            return errors[field]?.[0] || '';
        },
    }
}
</script>
