<script setup>
import { Field, Form } from 'vee-validate';
import * as Yup from 'yup';

import { useAuthStore } from '@/stores/auth';
import { onBeforeMount, onMounted, ref } from "vue";
import router from "@/router/index";
import useAnimations from '@/use/useAnimations';

const { enter, leave, beforeEnter } = useAnimations();

const authStore = useAuthStore();
const isPwdVisible = ref(false);

const schema = Yup.object().shape({
  username: Yup.string().trim().required('validateError'),
  password: Yup.string().required('validateError'),
});

function onSubmit(values, { setErrors }) {
  const { username, password } = values;
  return authStore.login({ username, password }).then(() => {
    router.push({ name: 'home' });
  })
    .catch(error => setErrors({ apiError: error }));
}

function togglePwdVisibility() {
  let pwdField = document.querySelector('#password');
  if (pwdField.getAttribute('type') === "password") {
    pwdField.setAttribute('type', 'text');
    isPwdVisible.value = true;
  } else {
    pwdField.setAttribute('type', 'password')
    isPwdVisible.value = false;
  }
}


onMounted(() => {
  // dashboardStore.clearData();
})

onBeforeMount(async () => {
  if (authStore.isAuthenticated) {
    await router.push({ name: 'home' });
  } else {
    try {
      authStore.fetchUser().then(() => {
        router.push({ name: 'home' });
      });
    } catch { }
  }
})

</script>

<template>
  <div
    class="w-full md:w-3/4 lg:w-1/2 p-8 rounded-3xl bg-transparent dark:bg-transparent md:bg-white md:dark:bg-gray-800 md:shadow-md md:focus-within:scale-[102%] transition-all duration-300 ease-in-out">
    <h1 class="text-center text-2xl font-semibold text-sky-500 mb-2">Sanly Çözgüt</h1>
    <p class="text-center text-gray-600 dark:text-gray-400 mb-6">{{ $t('signIn') }}</p>
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }" class="space-y-10">
      <div class="relative">
        <Field name="username" type="text" id="username" class="peer text-input" :placeholder="$t('username')"
          :class="{ 'is-invalid': errors.username }" />
        <label for="username" class="text-input-placeholder">
          {{ $t('username') }}
        </label>
        <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div v-if="!!errors.username">
            <p class="text-red-500 mt-2 mx-2">{{ $t(errors.username, { fieldName: $t('username') }) }}</p>
          </div>
        </transition>
      </div>
      <div class="relative">
        <Field name="password" type="password" id="password" :placeholder="$t('password')" class="peer text-input"
          :class="{ 'is-invalid': errors.password }" />
        <div class="absolute top-0 right-0 p-4" @click="togglePwdVisibility">
          <svg v-if="isPwdVisible" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            aria-hidden="true" role="img" viewBox="0 0 24 24" class="iconify iconify--lucide w-5 text-gray-500">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path
                d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575a1 1 0 0 1 0 .696a10.8 10.8 0 0 1-1.444 2.49m-6.41-.679a3 3 0 0 1-4.242-4.242">
              </path>
              <path
                d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 4.446-5.143M2 2l20 20">
              </path>
            </g>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true"
            role="img" viewBox="0 0 24 24" class="iconify iconify--lucide w-5 text-gray-500">
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <path
                d="M2.062 12.348a1 1 0 0 1 0-.696a10.75 10.75 0 0 1 19.876 0a1 1 0 0 1 0 .696a10.75 10.75 0 0 1-19.876 0">
              </path>
              <circle cx="12" cy="12" r="3"></circle>
            </g>
          </svg>
        </div>
        <label for="password" class="text-input-placeholder">
          {{ $t('password') }}
        </label>
        <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div v-if="!!errors.password">
            <p class="text-red-500 mt-2 mx-2">{{ $t(errors.password, { fieldName: $t('password') }) }}</p>
          </div>
        </transition>
      </div>
      <div class="flex flex-wrap justify-center mt-16">
        <button :disabled="isSubmitting" class="hover:scale-105 px-4 py-3 w-1/2 text-lg flex justify-center"
          :class="{ 'btn-secondary-without-p': isSubmitting, 'btn-base-without-p': !isSubmitting }">
          <svg v-if="isSubmitting" xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="currentColor" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
              opacity="0.25" />
            <path fill="currentColor"
              d="M10.72,19.9a8,8,0,0,1-6.5-9.79A7.77,7.77,0,0,1,10.4,4.16a8,8,0,0,1,9.49,6.52A1.54,1.54,0,0,0,21.38,12h.13a1.37,1.37,0,0,0,1.38-1.54,11,11,0,1,0-12.7,12.39A1.54,1.54,0,0,0,12,21.34h0A1.47,1.47,0,0,0,10.72,19.9Z">
              <animateTransform attributeName="transform" dur="0.75s" repeatCount="indefinite" type="rotate"
                values="0 12 12;360 12 12" />
            </path>
          </svg>
          <span v-else>{{ $t('login') }}</span>
        </button>
      </div>
    </Form>
  </div>
  </template>

<style scoped></style>
