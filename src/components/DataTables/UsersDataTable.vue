<script setup>
import { computed, defineProps, onBeforeMount, onMounted, ref, useTemplateRef, watch } from 'vue';

import { useUsersStore, useDataTableStore } from "@/stores/api.js";
import { storeToRefs } from "pinia";
import router from "@/router/index.js";
import ConfirmModal from '../Modals/ConfirmModal.vue';
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { useUxStore } from '@/stores/ux';

const dataTableStore = useDataTableStore();
const { t } = useTranslation();
const route = useRoute();
const store = useUsersStore()
const { deleteStatus, updateStatus, createStatus } = storeToRefs(store);
const uxStore = useUxStore();

const props = defineProps({
  data: Array,
  totalPages: Number,
})
const emit = defineEmits(["update"]);

const data = ref([]);
const filteredData = ref([]);
const selectedItem = ref(null);

const sortColumn = ref(route.query.column || "username");
const sortOrder = ref(route.query.order || 'asc');
const currentPage = ref(Number(route.query.page || 1));
const rowsPerPage = ref(localStorage.getItem("rowsPerPage") || 10);
const rowsPerPageOptions = [10, 20, 50, 100, 250, 500];
const searchQuery = ref(route.query.search || "");
const isSearching = ref(!!route.query.search || false);
const selectedItems = ref([]);

if (props.data.length > 0) {
  data.value = props.data;
  filteredData.value = [...data.value];
}

watch(props, (newVal, oldVal) => {
  data.value = newVal.data;
  filteredData.value = [...data.value];
})

const selectedItemsCount = computed(() => {
  return selectedItems.value.length
})

const isAllSelected = computed(() => {
  if (data.value.length === selectedItems.value.length) {
    return true;
  }
  return false;
})

const selectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = [];
  } else {
    selectedItems.value = data.value.map(item => item.id)
  }
}

const checkboxClicked = (id) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(item => item !== id);
  } else {
    selectedItems.value.push(id);
  }
}

const applySearch = () => {
  router.push({ name: 'users-list', query: { ...route.query, search: searchQuery.value } }).then(() => {
    emit('update')
  });
};

const resetTable = () => {
  const newQuery = { ...route.query };
  delete newQuery.search;

  router.replace({ query: newQuery }).then(() => {
    emit('update');
    isSearching.value = false;
  });
};


const changePage = (page) => {
  if (page >= 1 && page <= props.totalPages) {
    currentPage.value = page;
  }
};


const changeRowsPerPage = async (option) => {
  rowsPerPage.value = parseInt(option, 10);
  localStorage.setItem("rowsPerPage", rowsPerPage.value)
  if (currentPage.value === 1) {
    emit('update')
  } else {
    currentPage.value = 1;
  }
  isOpen.value = false;
};

const pagesBefore = computed(() => {
  const start = Math.max(2, currentPage.value - 2);
  return Array.from({ length: Math.max(0, currentPage.value - start) }, (_, i) => start + i);
});

const pagesAfter = computed(() => {
  const end = Math.min(props.totalPages - 1, currentPage.value + 2);
  return Array.from({ length: Math.max(0, end - currentPage.value) }, (_, i) => currentPage.value + i + 1);
});


const sort = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = column;
    sortOrder.value = 'asc';
  }
};
const isOpen = ref(false);


watch(deleteStatus, (newVal, oldVal) => {
  if (newVal) {
    if (newVal === 'success') {
      uxStore.addToast(t('deleteToast', { object: t('user') }), 'success');
    } else if (newVal === 'error') {
      uxStore.addToast(t('deleteToastError'), 'error');
    }
  }
  deleteStatus.value = null;
})

watch(currentPage, (newVal) => {
  router.push({ name: 'users-list', query: { ...route.query, page: newVal } }).then(() => {
    emit('update')
  });
})
watch(sortColumn, (newVal) => {
  setTimeout(() => {
    router.push({ name: 'users-list', query: { ...route.query, order: sortOrder.value, column: newVal } }).then(() => {
      emit('update');
    })
  }, 50)
})

watch(sortOrder, (newVal) => {
  router.push({ name: 'users-list', query: { ...route.query, order: newVal, column: sortColumn.value } }).then(() => {
    emit('update');
  })
})


onBeforeMount(() => {
  const rpp = localStorage.getItem('rowsPerPage');
  if (rpp) {
    rowsPerPage.value = parseInt(rpp);
  } else {
    localStorage.setItem("rowsPerPage", 10)
  }
})


onMounted(async () => {
  if (updateStatus.value) {
    if (updateStatus.value === 'success') {
      uxStore.addToast(t("editToast", { object: t('user') }), 'success');
    } else if (updateStatus.value === 'error') {
      uxStore.addToast(t('deleteToastError'), 'error');
    }
  }
  updateStatus.value = null;

  if (createStatus.value) {
    if (createStatus.value === 'success') {
      uxStore.addToast(t("createToast", { object: t('user') }), 'success');
    } else if (createStatus.value === 'error') {
      uxStore.addToast(t('createToastError'), 'error');
    }
  }
  createStatus.value = null;
})


const deleteModal = useTemplateRef('deleteModal');
const deleteSelectedModal = useTemplateRef('deleteSelectedModal');

function deleteItemConfirm(id) {
  selectedItem.value = id;
  deleteModal.value.openModal();
}

async function deleteItem() {
  await store._delete(selectedItem.value);
  emit('update')
}

async function deleteItems(model, identificators) {
  await dataTableStore.deleteSelectedItems(model, identificators);
  emit('update');
}

async function toggleFilter(key, value) {
  let query = route.query;

  if (value == route.query[key]) {
    delete query[key];
    await router.push({ name: 'users-list', query: { ...query } })
    emit('update');
  } else {
    query[key] = value;
    await router.push({ name: 'users-list', query: { ...query } })
    emit('update');
  }
}

async function resetFilter(key) {
  let query = route.query;
  switch (key) {
    case 'all':
      delete query['region'];
      delete query['country'];
      break;
    default:
      delete query[key]
  }
  await router.push({ name: 'users-list', query: { ...query } })
  emit('update');
}

</script>

<template>
  <confirm-modal ref="deleteModal" @confirm="deleteItem()">
    <template #header>
      {{ $t('confirm') }}
    </template>
    <template #default>
      {{ $t('deleteConfirmDesc') }}
    </template>
  </confirm-modal>
  <confirm-modal ref="deleteSelectedModal" @confirm="deleteItems('profile', selectedItems)">
    <template #header>
      {{ $t('confirm') }}
    </template>
    <template #default>
      {{ $t('deleteSelectedConfirmDesc') }}
    </template>
  </confirm-modal>
  <div class="w-full rounded-lg shadow-sm">
    <div class="pt-1 rounded-t-2xl bg-white dark:bg-gray-900">
      <div class="flex items-center justify-between space-x-2 py-3 px-4">
        <div class="flex items-center">
          <div class="dropdown">
            <div tabindex="0" role="button" class="btn-secondary-without-p px-4 py-2 text-sm">
              {{ $t('rowCount') }}: {{ rowsPerPage }}
            </div>
            <ul tabindex="0"
              class="dropdown-content bg-[#f6f6f6] dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 menu rounded-3xl z-1 w-52 p-2 shadow-sm">
              <li>
                <button v-for="option in rowsPerPageOptions" :key="option" :value="option"
                  @click="changeRowsPerPage(option)" class="flex items-center rounded-full">
                  {{ option }} {{ $t('rows') }}
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div class="lg:w-1/3 flex items-center justify-end space-x-2">
          <!-- <drawer-end>
            <template #btn><svg xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M22 3H2l8 9.46V19l4 2v-8.54z" />
              </svg></template>
            <template #content>
              <div class="flex justify-between items-center">
                <p class="text-black dark:text-white m-2 select-none font-semibold text-xl">{{ $t('filters') }}</p>
                <button class="btn-primary flex items-center space-x-2" @click="resetFilter('all')"><svg
                    xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2">
                      <path d="M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </g>
                  </svg><span>{{ $t('resetAll') }}</span></button>
              </div>
              <hr class="hr">
              <div class="flex justify-between items-center">
                <p class="text-black dark:text-white m-2 select-none font-semibold">{{ $t('regions') }}</p>
                <button class="btn-primary" @click="resetFilter('region')"><svg xmlns="http://www.w3.org/2000/svg"
                    class="w-4" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2">
                      <path d="M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </g>
                  </svg></button>
              </div>
              <div>
                <button class="m-2" @click="toggleFilter('region', item.id)"
                  :class="{ 'btn-secondary': route.query.region != item.id, 'btn-primary': route.query.region == item.id, }"
                  v-for="item in regions" :key="item.id">{{ item.name }}</button>
              </div>
              <div class="flex justify-between items-center">
                <p class="text-black dark:text-white m-2 select-none font-semibold">{{ $t('countries') }}</p>
                <button class="btn-primary" @click="resetFilter('country')"><svg xmlns="http://www.w3.org/2000/svg"
                    class="w-4" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                      stroke-width="2">
                      <path d="M21 12a9 9 0 0 0-9-9a9.75 9.75 0 0 0-6.74 2.74L3 8" />
                      <path d="M3 3v5h5m-5 4a9 9 0 0 0 9 9a9.75 9.75 0 0 0 6.74-2.74L21 16" />
                      <path d="M16 16h5v5" />
                    </g>
                  </svg></button>
              </div>
              <div>
                <button class="m-2" @click="toggleFilter('country', item.id)"
                  :class="{ 'btn-secondary': route.query.country != item.id, 'btn-primary': route.query.country == item.id, }"
                  v-for="item in countries" :key="item.id">{{ item.name }}</button>
              </div>
            </template>
          </drawer-end> -->
          <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn-secondary w-full">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </div>
            <ul tabindex="0"
              class="dropdown-content bg-[#f6f6f6] dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-800 menu rounded-3xl z-1 w-72 p-2 shadow-sm">
              <li class="px-4 py-2 select-none">{{ $t('objectsCount', {
                objectsCount: store.objectsCount
              }) }}</li>
              <li class="px-4 py-2 select-none" v-if="selectedItemsCount > 0">{{ $t('selectedObjectsCount', {
                selectedItemsCount
              }) }}</li>
              <hr class="hr">
              <li>
                <button @click="dataTableStore.getExportedFile('profile', selectedItems)"
                  class="flex items-center rounded-full">
                  {{ $t('exportData') }}
                </button>
              </li>
              <li>
                <button @click="deleteSelectedModal.openModal()" class="flex items-center rounded-full">
                  {{ $t('deleteData') }}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="mx-4 pb-4 flex">
        <div class="relative w-full">
          <input v-model="searchQuery" id="search" type="text" @keyup.enter="applySearch" :placeholder="$t('search')"
            class="peer search-input" />
          <div v-if="isSearching" class="btn-base absolute top-2.5 right-2 p-4" @click="resetTable">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"
              version="1.1" class="iconify iconify--lucide w-5">
              <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="Reload">
                  <rect id="Rectangle" fill-rule="nonzero" x="0" y="0" width="24" height="24">
                  </rect>
                  <path
                    d="M4,13 C4,17.4183 7.58172,21 12,21 C16.4183,21 20,17.4183 20,13 C20,8.58172 16.4183,5 12,5 C10.4407,5 8.98566,5.44609 7.75543,6.21762"
                    id="Path" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  </path>
                  <path
                    d="M9.2384,1.89795 L7.49856,5.83917 C7.27552,6.34441 7.50429,6.9348 8.00954,7.15784 L11.9508,8.89768"
                    id="Path" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  </path>
                </g>
              </g>
            </svg>

          </div>
          <label for="search" class="search-input-placeholder">
            {{ $t('search') }}
          </label>
        </div>

        <!-- <input v-model="searchQuery" type="text" @keyup.enter="applySearch" :placeholder="$t('search')"
          :class="{ 'rounded-l-md': isSearching, 'rounded-md': !isSearching }"
          class="w-full text-[0.8rem] md:text-sm dark:text-gray-300 transition duration-200 ease-in bg-transparent px-4 py-2 border border-gray-300 dark:border-gray-700 focus:ring focus:ring-emerald-300 dark:focus:ring-emerald-800 focus:outline-none" />
        <button @click="resetTable" v-if="isSearching"
          class="py-2 select-none text-nowrap px-3 text-[0.7rem] md:text-sm rounded-r-md shadow-md bg-emerald-500 dark:bg-emerald-900 text-white ring-0 ring-emerald-200 dark:ring-emerald-800 active:ring-4 duration-100 ease-in active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="w-6 h-6"
            viewBox="0 0 24 24" version="1.1">
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Reload">
                <rect id="Rectangle" fill-rule="nonzero" x="0" y="0" width="24" height="24">
                </rect>
                <path
                  d="M4,13 C4,17.4183 7.58172,21 12,21 C16.4183,21 20,17.4183 20,13 C20,8.58172 16.4183,5 12,5 C10.4407,5 8.98566,5.44609 7.75543,6.21762"
                  id="Path" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                </path>
                <path
                  d="M9.2384,1.89795 L7.49856,5.83917 C7.27552,6.34441 7.50429,6.9348 8.00954,7.15784 L11.9508,8.89768"
                  id="Path" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                </path>
              </g>
            </g>
          </svg>
        </button> -->
      </div>
    </div>
    <div class="w-full overflow-x-auto rounded-b-2xl">
      <table class="w-full min-w-full table-auto bg-white dark:bg-gray-900">
        <thead class="bg-gray-200 dark:bg-[#1a2334]">
          <tr>
            <th
              class="transition duration-200 ease-in border-gray-300 dark:border-gray-800 px-6 border-y select-none text-left">
              <button class="pt-2 select-none cursor-pointer" @click="selectAll">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle :class="{ 'opacity-0': !isAllSelected, 'opacity-100': isAllSelected }"
                    class="transition duration-300 ease-out" cx="12" cy="12" r="3">
                  </circle>
                </svg>
              </button>
            </th>
            <th class="table-head" @click="sort('id')">
              {{ $t('id').toUpperCase() }}
              <span :class="sortColumn === 'id' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'opacity-25'"
                class="ml-2 transition-transform duration-200 inline-block">
                ▲
              </span>
            </th>
            <th class="table-head" @click="sort('username')">
              {{ $t('username').toUpperCase() }}
              <span :class="sortColumn === 'username' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'opacity-25'"
                class="ml-2 transition-transform duration-200 inline-block">
                ▲
              </span>
            </th>
            <th class="table-head" @click="sort('role')">
              {{ $t('role').toUpperCase() }}
              <span :class="sortColumn === 'role' ? (sortOrder === 'asc' ? 'rotate-180' : '') : 'opacity-25'"
                class="ml-2 transition-transform duration-200 inline-block">
                ▲
              </span>
            </th>
            <th class="border-y border-gray-300 dark:border-gray-800 p-3 select-none text-center text-[0.8rem]">
              {{ $t("tools").toUpperCase() }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in data" :key="item.id" class="table-row">
            <td class="border-y border-gray-300 dark:border-gray-800 px-6">
              <button class="select-none" @click="checkboxClicked(item.id)">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle
                    :class="{ 'opacity-0': !selectedItems.includes(item.id), 'opacity-100': selectedItems.includes(item.id) }"
                    class="transition duration-300 ease-out" cx="12" cy="12" r="3">
                  </circle>
                </svg>
              </button>
            </td>
            <td class="border-y border-gray-300 dark:border-gray-800 px-4 py-2 break-words text-[0.8rem]">{{
              item.id
            }}
            </td>
            <td class="border-y border-gray-300 dark:border-gray-800 p-2 break-words text-[0.8rem]">{{
              item.username
            }}
            </td>
            <td class="border-y border-gray-300 dark:border-gray-800 p-2 break-words text-[0.8rem]">{{
              $t(item.role)
            }}
            </td>
            <td class="border-y border-gray-300 dark:border-gray-800 p-2 break-words text-[0.8rem]">
              <div class="w-full flex items-center justify-center">
                <div class="inline-flex rounded-md shadow-xs" role="group">
                  <button type="button" :key="item.id"
                    @click="router.push({ name: 'edit-education-center', params: { id: item.id } })"
                    class="px-4 py-2 text-[0.8rem] font-medium bg-emerald-400 hover:bg-emerald-500 transition ease-in hover:ease-out duration-200 text-white dark:bg-emerald-700 border border-gray-200 rounded-s-lg focus:z-10 focus:ring-2 focus:ring-emerald-500 dark:border-gray-700 select-none"
                    :title="$t('edit')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5" viewBox="0 0 24 24">
                      <title />
                      <g id="Complete">
                        <g id="edit">
                          <g>
                            <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none"
                              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                            <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8"
                              stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </button>
                  <button type="button" :key="item.id"
                    @click="router.push({ name: 'about-education-center', params: { id: item.id } })"
                    class="px-4 py-2 text-[0.8rem] font-medium bg-violet-400 hover:bg-violet-500 transition ease-in hover:ease-out duration-200 text-white dark:bg-violet-700 border border-gray-200 focus:z-10 focus:ring-2 focus:ring-violet-500 dark:border-gray-700 select-none"
                    :title="$t('view')">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                      aria-hidden="true" role="img" viewBox="0 0 24 24" class="iconify iconify--lucide w-5">
                      <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                        d="m6 14l1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2">
                      </path>
                    </svg>
                  </button>
                  <button type="button" :key="item.id" @click="deleteItemConfirm(item.id)"
                    class="px-4 py-2 text-[0.8rem] font-medium bg-red-400 hover:bg-red-500 transition ease-in hover:ease-out duration-200 text-white dark:bg-pink-900 dark:hover:bg-pink-600 border border-gray-200 rounded-e-lg focus:z-10 focus:ring-2 focus:ring-red-500 dark:border-gray-700 dark:focus:ring-pink-500 select-none"
                    :title="$t('delete')">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6M14 10V17M10 10V17"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="flex justify-center items-center mt-4 space-x-2 overflow-x-auto">
    <button class="select-none btn-secondary" v-if="currentPage !== 1" @click="changePage(currentPage - 1)">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13 8L9 12M9 12L13 16M9 12H21M19.4845 7C17.8699 4.58803 15.1204 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C15.1204 21 17.8699 19.412 19.4845 17"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <button class="select-none btn-secondary" v-if="currentPage > 3" @click="changePage(1)">
      1
    </button>

    <span v-if="currentPage > 4" class="px-2 select-none">...</span>

    <button class="select-none btn-secondary" v-for="page in pagesBefore" :key="'before-' + page"
      @click="changePage(page)">
      {{ page }}
    </button>

    <button class="select-none btn-base-without-p px-4 py-2" v-if="totalPages !== 0">
      <span class="dark:text-white">{{ currentPage }}</span>
    </button>

    <button class="select-none btn-secondary" v-for="page in pagesAfter" :key="'after-' + page"
      @click="changePage(page)">
      {{ page }}
    </button>

    <span v-if="currentPage < totalPages - 3" class="px-2 select-none">...</span>

    <button class="select-none btn-secondary" v-if="currentPage < totalPages - 2" @click="changePage(totalPages)">
      {{ totalPages }}
    </button>

    <button class="select-none btn-secondary" v-if="currentPage !== totalPages && totalPages !== 1"
      @click="changePage(currentPage + 1)">
      <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 16L15 12M15 12L11 8M15 12H3M4.51555 17C6.13007 19.412 8.87958 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C8.87958 3 6.13007 4.58803 4.51555 7"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </div>
</template>

<style scoped></style>
