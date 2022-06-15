<template>
  <div>
    <div class="flex flex-col h-screen text-sm text-gray-400">
      <div class="flex-1 flex">
        <h2>Table list</h2>
        <!-- form -->
        <div class="content w-1/3 flex-none flex flex-col justify-between">
          <form class="ml-2 my-10 px-20" @submit.prevent="addContact">
            <div class="type-infos">
              <input
                v-model="name"
                required
                class="shadow appearance-none border rounded w-full py-2 mb-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="name"
              />
              <input
                v-model="surname"
                required
                class="shadow appearance-none border rounded w-full py-2 mb-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                placeholder="phone number"
              />
            </div>
            <div class="submit-form">
              <button
                class="bg-gray-800 py-2 px-2 text-white hover:bg-blue-500 rounded"
                type="submit"
              >
                Add contact
              </button>
            </div>
          </form>
        </div>
        <!-- !form -->

        <!-- list of contacts -->
        <div class="content flex-1 w-2/3 flex flex-col">
          <div class="items-center mt-4">
            <div
              v-for="(contact, index) in contacts"
              :key="index"
              class="shadow-md bg-white w-auto inline-block px-4 py-4 mx-3 my-4"
            >
              <a class="remove" href="#r" @click="deleteContact(index)">
                <p
                  class="text-lg text-blue-600 text-justify font-serif border-b-2 pb-2"
                >
                  {{ contact.name }}
                </p>
                <p class="text-lg text-blue-700 pt-2">{{ contact.surname }}</p>
              </a>
            </div>
          </div>
        </div>
        <!-- !list of contacts -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { observable } from "vue/types/umd";
export default Vue.extend({
  data() {
    return {
      name: "",
      surname: "",
      contacts: [],
    };
  },
  methods: {
    addContact() {
      const contact = {
        name: this.name,
        surname: this.surname,
      } as never;
      this.contacts.push(contact);
      console.log(this.contacts);
    },
    deleteContact(index: string) {
      this.$delete(this.contacts, index);
    },
  },
});
</script>

<style scoped>
*,
*::before,
*::after {
  box-sizing: border-box;
}
:root {
  --input-border: #8b8a8b;
  --input-focus-h: 245;
  --input-focus-s: 100%;
  --input-focus-l: 42%;
}
.type-infos,
.submit-form,
.items-center {
  margin: 10px;
  padding: 10px;
}
.items-center {
  width: 100%;
}
input[type="text"] {
  padding: 10px;
  border: 0;
  box-shadow: 0 0 15px 4px rgba(0, 0, 0, 0.06);
}
button {
  /* remove default behavior */
  appearance: none;
  -webkit-appearance: none;
  /* usual styles */
  padding: 10px;
  border: none;
  background-color: #3f51b5;
  color: #fff;
  font-weight: 600;
  border-radius: 5px;
  width: 100%;
}
p {
  display: inline-block;
  width: 180px;
  margin: 6px;
  padding: 6px;
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  background: #999;
}
a {
  width: 100%;
  margin: 5px;
  padding: 5px;
}
a:before {
  content: "\1F5D1";
  margin: 10px;
}
</style>
