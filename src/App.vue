<template>
  <nav>
    <router-link to="/">Tabella</router-link> |
    <router-link to="/grafico">Grafico</router-link> |
    <router-link to="/tabella2">Tabella 2</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Lexend, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffffd8;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #ffffffd8;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
