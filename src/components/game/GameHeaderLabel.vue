<script setup lang="ts"></script>

<template>
  <div class="rounded-w-box text-2xl flex flex-row items-center justify-center py-2 gap-4">
    <img src="@/assets/img/N4FaceLook.webp" alt="N4 Face" class="h-16 w-16 shrink-0" />
    <div class="text-lg text-left font-bold">
      <slot />
    </div>
  </div>
</template>
