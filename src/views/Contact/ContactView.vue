<template>
  <div>
    <div class="hide-on-mobile p-4">
      <v-toolbar-title>Contact List</v-toolbar-title>
      <v-layout class="d-block">
        <div class="pa-2">
          <div class="d-flex">
            <div class="w-50 d-flex">
                <input type="text" class="form-basic-rad br-5px-left"
                    v-model="jsonDataParam.search"
                    @keyup.enter="jsonDataParam.iPage=1; apiGetContactList(true)"
                    placeholder="Search Contact">
                <div @click="jsonDataParam.iPage=1; apiGetContactList(true)" class="btn-search-new br-5px-right">
                    <v-icon icon="mdi-magnify"></v-icon>
                </div>
            </div>
            <div class="w-25 d-flex align-center ms-3">
                <select class="form-basic-rad select-form" v-model="jsonDataParam.groupid" @change="apiGetContactList(true)">
                    <option :value=0>all contact group</option>
                    <option :value="i.id" v-for="i in allGroupList" v-bind:key="i.id">{{ i.name }}</option>
                </select>
            </div>
            <div class="w-33 text-right d-flex justify-content-between">
              <v-btn 
                prepend-icon="mdi-upload"
                color="primary"
                class="mt-0 mb-0 ms-4 br-5px" 
                depressed
                @click="dialogUploadContact = true">
                  <template v-slot:prepend>
                    <v-icon color="white"></v-icon>
                  </template>
                  Upload Contact
              </v-btn>
              <v-btn 
                prepend-icon="mdi-plus"
                color="success"
                class="mt-0 mb-0 mr-0 br-5px" 
                depressed
                to="/addcontact">
                  <template v-slot:prepend>
                    <v-icon color="white"></v-icon>
                  </template>
                  Add Contact
              </v-btn>
            </div>
          </div>
        </div>

        <div class="pa-2">
            <v-data-table-server
              :headers="contactHeaders"
              :items="allContactList"
              :items-length="total_items"
              :loading="loading"
              :items-per-page="jsonDataParam.iTake"
              @update:options="loadItems"
              class="elevation-1"
              :disable-sort="true"
            >
              <template v-slot:loading>
                <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
              </template>
              <template v-slot:item="{ item }">
                <tr>
                  <td>{{ item.name }}</td>
                  <td>{{ item.phone_number }}</td>
                  <td>
                    {{ item.address }}
                    <!-- <div v-html="item.address"></div> -->
                  </td>
                  <td>{{ helper.filterByObjectid(allGroupList, item.group_id).length ? helper.filterByObjectid(allGroupList, item.group_id)[0].name : "" }}</td>
                  <td class="col-3">
                    <div>
                      <v-btn prepend-icon="mdi-pencil"
                        color="gray"
                        class="mt-0 mb-0 mr-0 br-5px small" 
                        depressed
                        :to="'/editcontact?id=' + item.id">
                          <template v-slot:prepend>
                            <v-icon color="gray"></v-icon>
                          </template>
                          Edit
                      </v-btn>
                      <v-btn prepend-icon="mdi-delete"
                        color="gray"
                        class="mt-0 mb-0 mr-0 br-5px small ma-5" 
                        depressed
                        @click="apiDeleteContactDetail(item)">
                          <template v-slot:prepend>
                            <v-icon color="gray"></v-icon>
                          </template>
                          Delete
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </template>
            </v-data-table-server>
        </div>

      </v-layout>
    </div>

    <div class="show-on-mobile pt-4">
      <v-toolbar-title>Contact List</v-toolbar-title>
      <v-layout class="d-block">
        <div class="pa-2">
            <div class="d-flex">
                <div class="w-60 d-flex">
                    <input type="text" class="form-basic-rad br-5px-left fs-6 "
                        v-model="jsonDataParam.search"
                        @keyup.enter="jsonDataParam.iPage=1; apiGetContactList(true)"
                        placeholder="Search Contact">
                    <div @click="jsonDataParam.iPage=1; apiGetContactList(true)" class="btn-search-new br-5px-right">
                        <v-icon icon="mdi-magnify"></v-icon>
                    </div>
                </div>
                <div class="w-40 d-flex align-center ms-3">
                    <select class="form-basic-rad select-form fs-6" v-model="jsonDataParam.groupid" @change="apiGetContactList(true)">
                        <option :value=0>all contact group</option>
                        <option :value="i.id" v-for="i in allGroupList" v-bind:key="i.id">{{ i.name }}</option>
                    </select>
                </div>
            </div>
        </div>

        <div class="pa-2 pt-0">
          <v-infinite-scroll
            @load="loadMore"
            :style="infiniteScrollStyle"
          >
            <template v-for="(item, index) in allContactList" :key="index">
              <v-menu
                v-model="item.menu"
                :close-on-content-click="true"
                location="end"
              >
                <template v-slot:activator="{ props }">
                  <v-list-item 
                    v-bind="props"
                    v-if="isSearchNumber"
                    :class="['pa-2', index % 2 === 0 ? 'bg-grey-lighten-2' : '']"
                  >
                    <template v-slot:title>
                      <span class="fs-5">{{ item.name }}</span>
                    </template>
                    <template v-slot:subtitle>
                      <span class="fs-6">{{ item.phone_number }}</span>
                    </template>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-account-circle" ></v-icon>
                    </template>
                  </v-list-item>
                  
                  <div :class="['pa-2 pb-3 pt-3', index % 2 === 0 ? 'bg-grey-lighten-2' : '']" v-bind="props" v-else>
                    <i class="fs-2 mdi mdi-account-circle pe-2"></i>
                    <span>{{ item.name }}</span>
                  </div>
                </template>

                <v-list>
                  <v-list-item :to="'/editcontact?id=' + item.id">
                    <v-icon icon="mdi-pencil" color="gray"></v-icon>
                    Edit
                  </v-list-item>

                  <v-list-item @click="apiDeleteContactDetail(item)">
                    <v-icon icon="mdi-delete" color="gray"></v-icon>
                    Delete
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <v-row justify="center" v-if="loading">
              <v-progress-circular indeterminate></v-progress-circular>
            </v-row>
          </v-infinite-scroll>
        </div>

        <v-fab
          class="ms-4"
          color="cyan-accent-2"
          icon="mdi-plus"
          location="bottom right"
          size="50"
          absolute
          offset
          style="bottom: 30px; right: 10px;"
          to="/addcontact"
        ></v-fab>
      </v-layout>
    </div>
    

    <DialogUploadContact v-model:propsDialogUploadContact="dialogUploadContact" @emitCloseDialogUpload="onCloseDialogUploadContact"></DialogUploadContact>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { GetContactList, DeleteContactDetail } from 'Api/ContactService'
import { GetGroupList } from 'Api/GroupService'
import helper from 'JS/helper'
import Swal from 'sweetalert2'
import DialogUploadContact from 'Components/Dialog/DialogUploadContact.vue'

export default {
  components: {
    DialogUploadContact
  },
  data: () => ({
    helper,
    loading: false,
    contactHeaders: [
      { title: 'Name', key: 'name' },
      { title: 'Phone Number', key: 'phone_number' },
      { title: 'Address', key: 'address' },
      { title: 'Group', key: 'group_name' },
      { title: 'Action', key: '' }
    ],  
    jsonDataParam: {
      groupid: 0,
      search: '',
      iPage: 1,
      iTake: 10,
    },
    allContactList: [],
    allGroupList: [],
    maxPage: 1,
    total_items: 10,
    dialogUploadContact: false,
  }),
  computed: {
    ...mapGetters([
      "allContactGroup",
    ]),
    isSearchNumber() {
      return /^\d+$/.test(this.jsonDataParam.search)
    },
    isCanLoadMore() {
      return this.jsonDataParam.iPage < this.maxPage;
    },
    infiniteScrollStyle() {
      return {
        height: `calc(100vh - 200px)`,
        overflow: 'auto',
      };
    },
  },
  created () {
    if (this.isMobile) {
      this.apiGetContactList(true);
    }
    this.apiGetGroupList()
  },
  methods: {
    ...mapActions(['setAllContactGroup']),
    loadItems ({ page, itemsPerPage, sortBy }) {
      this.jsonDataParam.iPage = page
      this.jsonDataParam.iTake = itemsPerPage
      this.apiGetContactList(true)
    },
    async apiGetContactList(reset = false) {
      this.loading = true
      if (reset) {
        this.allContactList = [];
      }
      await GetContactList(this.jsonDataParam.search, this.jsonDataParam.groupid, this.jsonDataParam.iPage, this.jsonDataParam.iTake)
        .then(response => {
          this.loading = false
          this.allContactList.push(...response.data.data.data);
          this.allContactList = this.allContactList.map(obj => ({ ...obj, menu: false }));
          this.maxPage = response.data.data.last_page
          this.total_items = response.data.data.total
        })
        .catch(error => {
          this.loading = false
          console.log(error)
        })
    },
    apiDeleteContactDetail(selectedItem) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "<span class='text-white'>Yes, delete it!</span>",
        cancelButtonText: "<span class='text-white'>Cancel</span>"
      }).then((result) => {
        if (result.isConfirmed) {
          DeleteContactDetail(selectedItem.id)
            .then(response => {
              this.loading = false
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Contact has been removed",
                showConfirmButton: false,
                timer: 1500
              })
              this.apiGetContactList(true);
            })
            .catch(error => {
              console.log(error)
            })
        }
      });
    },
    async apiGetGroupList() {
      await GetGroupList()
        .then(response => {
          this.allGroupList = response.data.data
          this.setAllContactGroup(this.allGroupList)
        })
        .catch(error => {
          console.log(error)
        })
    },
    async loadMore({ side, done }) {
      setTimeout(() => {
        if (this.isCanLoadMore && side === 'end') {
          this.jsonDataParam.iPage++
          this.apiGetContactList();
        }
        done('ok')
      }, 1000)
    },
    onCloseDialogUploadContact(refresh){
      this.dialogUploadContact = false
      if (refresh){
        this.apiGetContactList(true)
        this.apiGetGroupList()
      }
    },
  }
}
</script>