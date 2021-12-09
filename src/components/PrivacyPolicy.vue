<template>
    <main class="policy-wrap" aria-labelledby="priv-pol-heading">
        <h1 id="priv-pol-heading">Privacy Policy</h1>
        <p class="py-12">Information about privacy that you should read in detail.</p>
        <button class="btn-primary" @click="confirm">OK, I read it</button>
    </main>
</template>

<script>
export default {
    name: 'PrivacyPolicy',
    methods: {
        confirm() {
            this.$emit('confirm')
        }
    }
}
</script>

<style scoped>
.btn-primary {
    background: #3498db;
    color: #ffffff;
    appearance: none;
    -webkit-appearance: none;
    font-family: sans-serif;
    cursor: pointer;
    padding: 12px;
    min-width: 100px;
    border: 0px;
    -webkit-transition: background-color 100ms linear;
    -ms-transition: background-color 100ms linear;
    transition: background-color 100ms linear;
}
.btn-primary:hover {
    background: #2980b9;
    color: #ffffff;
}
.policy-wrap {
    color: black;
    text-align: left;
    border: 1px solid rgba(0, 0, 0, 0.4);
    padding: 4rem;
}
</style>
