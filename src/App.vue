<script setup>
</script>

<template>
  <n-message-provider>
    <router-view :key="$route.fullPath"/>
  </n-message-provider>
</template>
