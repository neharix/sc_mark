<script setup>
import router from '@/router';
import { useUsersStore } from '@/stores/api';
import useAnimations from '@/use/useAnimations';
import { Form, Field } from 'vee-validate';
import { ref } from 'vue';
import * as Yup from 'yup';

const { leave, enter, beforeEnter } = useAnimations();

const usersStore = useUsersStore();
const isPwdVisible = ref(false);
const isConfirmPwdVisible = ref(false);


const schema = Yup.object().shape({
  username: Yup.string().trim().required('requiredError'),
  password: Yup.string().required('requiredError'),
  confirmPassword: Yup.string().required('requiredError'),
  firstName: Yup.string().trim().required('requiredError'),
  lastName: Yup.string().trim().required('requiredError'),
  email: Yup.string().trim().email("emailError").required("requiredError")
});

async function onSubmit(values, { setErrors }) {
  const { username, password, confirmPassword, firstName, lastName, email } = values;

  if (password === confirmPassword) {
    return usersStore.create({ username, password, firstName, lastName, email }).then(() => {
      router.push({ name: 'juries-list' });
    })
      .catch(error => setErrors({ apiError: error }));
  }
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

function toggleConfirmPwdVisibility() {
  let pwdField = document.querySelector('#confirmPassword');
  if (pwdField.getAttribute('type') === "password") {
    pwdField.setAttribute('type', 'text');
    isConfirmPwdVisible.value = true;
  } else {
    pwdField.setAttribute('type', 'password')
    isConfirmPwdVisible.value = false;
  }
}

</script>
<template>
  <div class="mb-4 mx-2">
    <div class="flex w-full justify-between">
      <div>
        <button class="btn-base" @click="router.go(-1)">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="m12 19l-7-7l7-7m7 7H5" />
          </svg>
        </button>
      </div>
    </div>
  </div>
  <div class="main-bg p-4 rounded-2xl shadow-sm">
    <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors, isSubmitting }" class="space-y-4">
      <h2 class="text-2xl font-bold mx-2 mt-2">
        {{ $t('addJury') }}
      </h2>
      <div class="relative">
        <Field name="username" type="text" id="username" class="peer text-input" :placeholder="$t('username') + '*'"
          :class="{ 'is-invalid': errors.username }" />
        <label for="username" class="text-input-placeholder">
          {{ $t('username') + '*' }}
        </label>
        <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div v-if="!!errors.username">
            <p class="text-red-500 mt-2 mx-2">{{ $t(errors.username, { fieldName: $t('username') }) }}</p>
          </div>
        </transition>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="relative">
          <Field name="password" type="password" id="password" :placeholder="$t('password') + '*'"
            class="peer text-input" :class="{ 'is-invalid': errors.password }" />
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
            {{ $t('password') + '*' }}
          </label>
          <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <div v-if="!!errors.password">
              <p class="text-red-500 mt-2 mx-2">{{ $t(errors.password, { fieldName: $t('password') }) }}</p>
            </div>
          </transition>
        </div>
        <div class="relative">
          <Field name="confirmPassword" type="password" id="confirmPassword" :placeholder="$t('confirmPassword') + '*'"
            class="peer text-input" :class="{ 'is-invalid': errors.confirmPassword }" />
          <div class="absolute top-0 right-0 p-4" @click="toggleConfirmPwdVisibility">
            <svg v-if="isConfirmPwdVisible" xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" viewBox="0 0 24 24"
              class="w-5 text-gray-500">
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
          <label for="confirmPassword" class="text-input-placeholder">
            {{ $t('confirmPassword') + '*' }}
          </label>
          <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <div v-if="!!errors.confirmPassword">
              <p class="text-red-500 mt-2 mx-2">{{ $t(errors.confirmPassword, { fieldName: $t('confirmPassword') }) }}
              </p>
            </div>
          </transition>
        </div>
        <div class="relative">
          <Field name="lastName" type="text" id="lastName" class="peer text-input" :placeholder="$t('lastName') + '*'"
            :class="{ 'is-invalid': errors.lastName }" />
          <label for="lastName" class="text-input-placeholder">
            {{ $t('lastName') + '*' }}
          </label>
          <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <div v-if="!!errors.lastName">
              <p class="text-red-500 mt-2 mx-2">{{ $t(errors.lastName, { fieldName: $t('lastName') }) }}</p>
            </div>
          </transition>
        </div>
        <div class="relative">
          <Field name="firstName" type="text" id="firstName" class="peer text-input"
            :placeholder="$t('firstName') + '*'" :class="{ 'is-invalid': errors.firstName }" />
          <label for="firstName" class="text-input-placeholder">
            {{ $t('firstName') + '*' }}
          </label>
          <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <div v-if="!!errors.firstName">
              <p class="text-red-500 mt-2 mx-2">{{ $t(errors.firstName, { fieldName: $t('firstName') }) }}</p>
            </div>
          </transition>
        </div>
      </div>
      <div class="relative">
        <Field name="email" type="email" id="email" class="peer text-input" :placeholder="$t('email') + '*'"
          :class="{ 'is-invalid': errors.email }" />
        <label for="username" class="text-input-placeholder">
          {{ $t('email') + '*' }}
        </label>
        <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
          <div v-if="!!errors.email">
            <p class="text-red-500 mt-2 mx-2">{{ $t(errors.email, { fieldName: $t('email') }) }}</p>
          </div>
        </transition>
      </div>


      <div class="flex flex-wrap justify-between mt-8">
        <div>
          <transition name="fade-slide" @before-enter="beforeEnter" @enter="enter" @leave="leave">
            <div v-if="!!errors.apiError">
              <p class="text-red-500 mt-2 mx-2">{{ errors.apiError }}</p>
            </div>
          </transition>
        </div>
        <button :disabled="isSubmitting" class="hover:scale-105 px-3 py-2 flex justify-center space-x-2"
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
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-6" viewBox="0 0 24 24">
            <rect width="24" height="24" fill="none" />
            <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12h8m-4-4v8" />
            </g>
          </svg>
          <span v-if="isSubmitting">{{ $t('adding') }}</span>
          <span v-else>{{ $t('add') }}</span>
        </button>
      </div>
    </Form>
  </div>
</template>
