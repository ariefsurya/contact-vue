<template>
  <v-layout class="d-block p-4">
    <!-- <b-spinner v-if="true" label="Spinning" variant="primary"></b-spinner> -->
    
    <div v-if="loading" class="spinner-container">
      <v-progress-circular indeterminate :size="50" :width="6"></v-progress-circular>
      <!-- <div class="spinner"></div> -->
    </div>
    <v-form ref="form" @submit.prevent="submitForm" class="hide-on-mobile">
      <div class="d-flex">
        <div class="w-25">
            Name
        </div>
        <div class="w-75 pr-15">
          <v-text-field v-model="contactDetail.name"
            :error-messages="v$.contactDetail.name.$errors.map(e => e.$message)"
            placeholder="Name"
            variant="outlined"
            required
          ></v-text-field>
        </div>
      </div>
      
      <div class="d-flex">
        <div class="w-25">
            Phone Number
        </div>
        <div class="w-75 pr-15">
          <v-text-field v-model="contactDetail.phone_number"
            :error-messages="v$.contactDetail.phone_number.$errors.map(e => e.$message)"
            placeholder="08xxxxxxxxxx"
            onkeypress='return event.charCode >= 48 && event.charCode <= 57'
            variant="outlined"
            required
          ></v-text-field>
        </div>
      </div>
      
      <div class="d-flex">
        <div class="w-25">
            Address
        </div>
        <div class="w-75 pr-15">
          <v-textarea v-model="contactDetail.address"
            :rows="2"
            :error-messages="v$.contactDetail.address.$errors.map(e => e.$message)"
            placeholder="Address"
            variant="outlined"
            required
          ></v-textarea>
        </div>
      </div>
      
      <div class="d-flex">
        <div class="w-25">
            Group Name
        </div>
        <div class="w-75 pr-15">
          <v-autocomplete  v-model="contactDetail.group_name"
            :items="allGroupList"
            variant="outlined"
            item-value="name"
            item-title="name"
            @update:search="updatesearch"
            @blur="addNewGroupName"
            :hide-no-data="true"
          ></v-autocomplete>
        </div>
      </div>

      <div class="text-right pt-4 pr-15">
        <v-btn type="button" color="danger" class="text-white" @click="$router.go(-1)">Cancel</v-btn>
        <v-btn type="submit" color="primary" class="ms-10" @click="v$.$validate">Save</v-btn>
      </div>
    </v-form>

    <v-form ref="form" @submit.prevent="submitForm" class="show-on-mobile">
      <div class="d-block">
        <div>
            Name
        </div>
        <div>
          <v-text-field v-model="contactDetail.name"
            :error-messages="v$.contactDetail.name.$errors.map(e => e.$message)"
            placeholder="Name"
            variant="outlined"
            required
          ></v-text-field>
        </div>
      </div>
      
      <div>
        <div >
            Phone Number
        </div>
        <div>
          <v-text-field v-model="contactDetail.phone_number"
            :error-messages="v$.contactDetail.phone_number.$errors.map(e => e.$message)"
            placeholder="08xxxxxxxxxx"
            onkeypress='return event.charCode >= 48 && event.charCode <= 57'
            variant="outlined"
            required
          ></v-text-field>
        </div>
      </div>
      
      <div>
        <div>
            Address
        </div>
        <div>
          <v-textarea v-model="contactDetail.address"
            :rows="2"
            :error-messages="v$.contactDetail.address.$errors.map(e => e.$message)"
            placeholder="Address"
            variant="outlined"
            required
          ></v-textarea>
        </div>
      </div>
      
      <div class="d-block">
        <div>
            Group Name
        </div>
        <div>
          <v-autocomplete  v-model="contactDetail.group_name"
            :items="allGroupList"
            variant="outlined"
            item-value="name"
            item-title="name"
            @update:search="updatesearch"
            @blur="addNewGroupName"
            :hide-no-data="true"
          ></v-autocomplete>
        </div>
      </div>

      <div class="text-right pt-4">
        <v-btn type="button" color="danger" class="text-white" @click="$router.go(-1)">Cancel</v-btn>
        <v-btn type="submit" color="primary" class="ms-10" @click="v$.$validate">Save</v-btn>
      </div>
    </v-form>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex"
import { GetContactDetail, AddContactDetail, UpdateContactDetail } from 'Api/ContactService'
import { GetGroupList } from 'Api/GroupService'
import helper from 'JS/helper'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import Swal from 'sweetalert2'

export default {
  data: () => ({
    helper,
    loading: false,
    contactId: 0,
    contactDetail: {
      id: 0,
      name: "",
      phone_number: "",
      address: "",
      group_id: 0,
      group_name: ""
    },
    allGroupList: [],
    selectedGroup: null,
    searchtext: ""
  }),
  computed: {
    ...mapGetters([
      "allContactGroup",
    ]),
  },
  validations() {
    return {
      contactDetail: {
        name: { required },
        phone_number: { required, minLength: minLength(8), maxLength: maxLength(13) },
        address: { required }
      }
    }
  },
  setup() {
    const v$ = useVuelidate()
    return { v$ }
  },
  created () {
    this.contactId = helper.getQueryVariable("id", 0)
    if (!helper.isObjectEmpty(this.contactId)) {
      this.apiGetContactDetail()
    }
    this.apiGetGroupList()
  },
  methods: {
    ...mapActions(['setAllContactGroup']),
    apiGetContactDetail() {
      this.loading = true
      GetContactDetail(this.contactId)
        .then(response => {
          this.loading = false
          this.contactDetail = response.data.data
          if (this.contactDetail.group_id != 0 && !helper.isObjectEmpty(this.allGroupList)) {
            this.contactDetail.group_name = helper.filterByObjectid(this.allGroupList, this.contactDetail.group_id)[0].name
          }
        })
        .catch(error => {
          this.loading = false
          console.log(error)
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Contact not found",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.$router.push('/')
          })
        })
    },
    apiGetGroupList() {
      if (helper.isObjectEmpty(this.allContactGroup)) {
        GetGroupList()
          .then(response => {
            this.allGroupList = response.data.data
            this.setAllContactGroup(this.allGroupList)
          })
          .catch(error => {
            console.log(error)
          })
      }
      else {
        this.allGroupList = this.allContactGroup
      }
    },
    async submitForm() {
      const isFormCorrect = await this.v$.$validate()

        if (isFormCorrect) {
          if (!helper.isObjectEmpty(this.contactId)) {
            this.apiUpdateContactDetail()
          }
          else {
            this.apiAddContactDetail()
          }
        }
    },
    apiAddContactDetail() {
      this.loading = true
      AddContactDetail(this.contactDetail)
        .then(response => {
          this.loading = false
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Contact has been saved",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.$router.push('/')
          })
        })
        .catch(error => {
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
    apiUpdateContactDetail() {
      this.loading = true
      UpdateContactDetail(this.contactId, this.contactDetail)
        .then(response => {
          this.loading = false
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Contact has been saved",
            showConfirmButton: false,
            timer: 1500
          }).then((result) => {
            this.$router.push('/')
          })
        })
        .catch(error => {
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
    updatesearch(term) {
      this.searchtext = term
    },
    addNewGroupName() {
      if (this.searchtext && !this.allGroupList.some(group => group.name === this.searchtext)) {
        this.allGroupList.push({ id: 0, name: this.searchtext })
        this.contactDetail.group_name = this.searchtext
      }
    }
  }
}
</script>
