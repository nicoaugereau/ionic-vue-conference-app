<template>
  <div class="signupSection">
    <form @submit.prevent="handleFormSubmit" class="signupForm">
      <h2 class="text-3xl text-gray-800 mb-4">{{ title }}</h2>
      <InputField
        name="username"
        type="text"
        label="Username"
        :submitted="submitted"
        requiredMessage="Username is required"
        auto-complete="username"
        v-model="username"
      ></InputField>
      <InputField
        name="password"
        type="password"
        label="Password"
        :submitted="submitted"
        requiredMessage="Password is required"
        auto-complete="current-password"
        v-model="password"
      ></InputField>
      <Button type="submit">Login</Button>
      <div class="text-red-500 mt-2">
        {{ errorMessage }}
      </div>
    </form>
  </div>
</template>

<script>
import InputField from "./InputField.vue";
import Button from "./Button.vue";
export default {
  components: {
    InputField,
    Button,
  },
  props: {
    title: {
      type: String,
      default: "Log In",
    },
    errorMessage: String,
    onLogin: Function,
  },
  data() {
    return {
      username: "",
      password: "",
      submitted: false,
    };
  },
  methods: {
    handleFormSubmit() {
      if (this.username && this.password) {
        this.onLogin({ username: this.username, password: this.password });
      }
      this.submitted = true;
    },
  },
  // name: 'LoginForm',
  // props: {
  //   title: String,
  //   onLogin: Function,
  // },
  // setup(props) {
  //   const title = computed(() => props.title || 'Log In');
  //   const username = ref('');
  //   const password = ref('');
  //   const submitted = ref(false);
  //   const formSubmit = () => {
  //     if (username.value && password.value) {
  //       props.onLogin({ username: username.value, password: password.value });
  //     }
  //     submitted.value = true;
  //   };
  //   return { formSubmit, title, username, password, submitted };
  // },
};
</script>

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300);
/* @import "https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"; */

* {
  font-family: "Open Sans", sans-serif;
}
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  background: #111;
}
.signupSection {
  position: absolute;
  top: 5%;
  left: 5%;
  width: 500px;
  height: 450px;
  text-align: center;
  display: flex;
  color: black;
}
h2 {
  padding-top: 30px;
  font-weight: 300;
}
.signupForm {
  width: 80%;
  padding: 30px 0;
  transition: 0.2s;
}
</style>
