<template>
  <span class="spinner" :style="style"></span>
</template>
<script>
  export default {
    name: 'Spinner',
    props: {
      color: {
        type: String,
        default: '#3498db'
      },
      size: {
        type: Number,
        default: 18
      },
      width: {
        type: Number,
        default: 4
      },
      duration: {
        type: String,
        default: '1s'
      }
    },
    computed: {
      style () {
        return {
          borderTopColor: this.color,
          width: `${this.size}px`,
          height: `${this.size}px`,
          borderWidth: `${this.width}px`,
          animationDuration: this.duration
        }
      }
    }
  }
</script>
<style scoped>
  .spinner {
    opacity: 1;
    display: inline-block;
    vertical-align: middle;
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 18px;
    height: 18px;
    animation: spin 1s linear infinite;
    margin: 0 0 0 10px;
    padding: 0;
    transition: all 0.2s ease;
  }

  .hidden > .spinner {
    max-width: 0 !important;
    max-height: 0 !important;
    border-width: 0 !important;
    margin: 0;
    opacity: 0;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
