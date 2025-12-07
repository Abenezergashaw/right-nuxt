<template>
  <div class="coming-soon-wrapper">
    <div class="glow-circle"></div>

    <transition name="fade-up">
      <h1 v-if="show" class="title">GAME<br />COMING SOON</h1>
    </transition>

    <transition name="pulse">
      <p v-if="show" class="subtitle">Get ready for something exciting</p>
    </transition>

    <transition name="fade-in">
      <!-- <div v-if="show" class="loader"></div> -->
      <UButton
        size="xl"
        variant="neutral"
        :loading="show"
        loading-icon="i-heroicons-paper-airplane"
      />
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const show = ref(false);

onMounted(() => {
  setTimeout(() => (show.value = true), 200);
});
</script>

<style scoped>
.coming-soon-wrapper {
  width: 100%;
  height: 100vh;
  background: #486333;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 50px;

  position: relative;
  overflow: hidden;
  text-align: center;
}

/* Background animated glow */
.glow-circle {
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  filter: blur(80px);
  animation: float 6s ease-in-out infinite alternate;
}

@keyframes float {
  0% {
    transform: translateY(-40px);
  }
  100% {
    transform: translateY(40px);
  }
}

.title {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-top: 12px;
}

/* Loader */
.loader {
  margin-top: 40px;
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Animations */
.fade-up-enter-active {
  animation: fadeUp 0.8s ease forwards;
}
@keyframes fadeUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.pulse-enter-active {
  animation: pulseAnim 1.2s ease forwards;
}
@keyframes pulseAnim {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-in-enter-active {
  animation: fadeIn 1.5s ease forwards;
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
