<template>
  <div class="secret-fullscreen-bg">
    <img
      src="@/assets/game/mistery.png"
      alt="Mystery"
      class="bg-mystery-img img-one"
    />
    <img
      src="@/assets/game/revealed.png"
      alt="Revealed"
      class="bg-mystery-img img-two"
    />

    <h1 class="victory-title" @click="goToHome">CONGRATS'</h1>

    <div class="win-container">
      <div class="win-box">
        <p><strong>Congratulations!</strong></p>
        <p>
          You’ve uncovered our secret product, part of our upcoming drop for
          <strong>SS@3</strong>, launching in <strong>June 2025</strong>.
        </p>
        <p>
          Since you’ve completed our minigame, we’ve sent you a confirmation email —
          you’re now entered into a <strong>raffle</strong> that will take place
          <strong>before our official drop</strong>.
        </p>
        <p>
          Up for grabs? <strong>10 exclusive “Fortuna Trucker” caps</strong>.
        </p>
        <p>
          To find out if you’ve won, just keep an eye on your inbox on
          <strong>June 1st, 2025</strong>.
        </p>
        <p>Thanks for playing,</p>
        <p><em>— The Ephemeral Team</em></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SecretPage",
  methods: {
    goToHome() {
      this.$router.push("/home");
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: 'Long Tall Sally';
  src: url('@/assets/fonts/LongTall.ttf') format('truetype');
  font-weight: normal;
  font-style: normal;
}

.secret-fullscreen-bg {
  position: relative;
  height: 100vh;
  overflow: hidden;
  background-color: #fdfdfd;
}

/* Images */
.bg-mystery-img {
  position: absolute;
  top: 30%;
  left: 50%;
  width: 45vw;
  height: 45vw;
  max-width: 600px;
  max-height: 600px;
  min-width: 250px;
  min-height: 250px;
  object-fit: cover;
  transform: translate(-50%, -50%);
  transition: opacity 1s ease-in-out;
  z-index: 0;
}

.img-one {
  animation: fadeInOut 6s ease-in-out infinite;
}

.img-two {
  animation: fadeOutIn 6s ease-in-out infinite;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes fadeOutIn {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* Title */
.victory-title {
  font-family: 'Long Tall Sally', sans-serif;
  font-weight: normal;
  color: #111111;
  text-align: center;
  letter-spacing: 1vw;
  cursor: pointer;
  font-size: 15vw;
  margin-top: 10vh;
  position: relative;
  z-index: 1;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.victory-title:hover {
  color: #111111;
  text-shadow: 0 0 10px #111111, 0 0 20px #111111;
}

/* Container */
.win-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 2;
  margin-top: 10vh;
}

.win-box {
  max-width: 800px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  border-radius: 12px;
  color: #111111;
  line-height: 1.3;
  font-size: 1rem;
}

/* Tablet e schermi medi */
@media (max-width: 1024px) {
  .victory-title {
    font-size: 22vw;
    margin-top: 16vh;
  }

  .bg-mystery-img {
    width: 60vw;
    height: 60vw;
  }
}

/* Smartphone grandi / phablet */
@media (max-width: 768px) {
  .victory-title {
    font-size: 30vw; /* più grande di prima, ma ancora gestibile */
    margin-top: 20vh;
  }

  .win-box {
    margin-bottom: 70px;
    font-size: 0.95rem;
  }

  .bg-mystery-img {
    width: 50vw;
    height: 50vw;
    margin-bottom: 30vh;
  }
}

</style>

