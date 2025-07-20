<script setup>
import { ref } from 'vue';

const emit = defineEmits(['confirm', 'close']);


const isOpen = ref(false);

const openModal = () => {
  isOpen.value = true;
};

const confirm = () => {
  isOpen.value = false;
  emit('confirm');
}

const close = () => {
  isOpen.value = false;

};

defineExpose({
  openModal,
});
</script>

<template>
  <teleport to="#modals">
    <div class="modal" :class="{ 'modal-open': isOpen }">
      <div class="modal-box bg-mbg dark:bg-mdbg select-none">
        <h3 class="font-bold text-lg text-black dark:text-white">
          <slot name="header" />
        </h3>
        <div class="text-gray-800 dark:text-gray-200 my-2">
          <slot name="default"></slot>
        </div>
        <div class="modal-action">
          <button class="btn-base-without-p px-4 py-2" @click="close">{{ $t('close') }}</button>
          <button class="btn-base-without-p px-4 py-2" @click="confirm">{{ $t('confirm') }}</button>
        </div>
      </div>
    </div>
  </teleport>
</template>
