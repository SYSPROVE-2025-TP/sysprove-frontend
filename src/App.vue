<template>
  <q-layout>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
defineOptions({
  name: "App",
});
</script>
<style>
* {
  box-sizing: border-box;
}
</style>
