<script setup lang="ts"></script>

<template>
  <div class="rounded-w-box flex flex-row items-center justify-center gap-4 py-2 text-2xl">
    <img src="@/assets/img/N4FaceLook.webp" alt="N4 Face" class="h-16 w-16 shrink-0" />
    <div class="text-left text-lg font-bold">
      <slot />
    </div>
  </div>
</template>
